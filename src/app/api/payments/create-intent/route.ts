import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe-server'
import { createClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      vehicleId, 
      startDate, 
      endDate, 
      totalAmount,
      customerEmail,
      customerName,
      couponCode,
      estimatedMiles
    } = body

    // Validate required fields
    if (!vehicleId || !startDate || !endDate || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      )
    }

    // Fetch vehicle details
    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .select(`
        name, 
        price_per_day, 
        seller_id,
        fuel_types(name)
      `)
      .eq('id', vehicleId)
      .eq('status', 'active')
      .single()

    if (vehicleError || !vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found or not available' }, 
        { status: 404 }
      )
    }

    // Get platform settings
    const { data: platformSettings } = await supabase
      .from('platform_settings')
      .select('key, value')
      .in('key', [
        'platform_fee_percentage',
        'platform_fee_fixed', 
        'platform_fee_type',
        'tax_rate'
      ])

    const settings = platformSettings?.reduce((acc, setting) => {
      acc[setting.key] = setting.value as string | number
      return acc
    }, {} as Record<string, string | number>) || {}

    // Calculate booking duration
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    // Calculate subtotal
    const subtotal = (vehicle.price_per_day || 0) * days

    // Calculate platform fee
    const platformFeeType = settings.platform_fee_type || 'percentage'
    const platformFeePercentage = parseFloat(String(settings.platform_fee_percentage || '5'))
    const platformFeeFixed = parseFloat(String(settings.platform_fee_fixed || '0'))
    
    let platformFee = 0
    if (platformFeeType === 'percentage') {
      platformFee = (subtotal * platformFeePercentage) / 100
    } else {
      platformFee = platformFeeFixed
    }

    // Calculate tax
    const taxRate = parseFloat(String(settings.tax_rate || '8.5'))
    const taxes = ((subtotal + platformFee) * taxRate) / 100

    // Apply coupon if provided
    let couponDiscount = 0
    let couponDetails = null
    
    if (couponCode) {
      const couponResponse = await fetch(`${request.url.replace('/api/payments/create-intent', '/api/coupons/validate')}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': request.headers.get('Authorization') || '',
        },
        body: JSON.stringify({
          code: couponCode,
          subtotal: subtotal + platformFee
        })
      })

      if (couponResponse.ok) {
        const couponData = await couponResponse.json()
        if (couponData.valid) {
          couponDiscount = couponData.discount_amount
          couponDetails = couponData.coupon
        }
      }
    }

    // Calculate final total
    const finalTotal = Math.max(0, subtotal + platformFee + taxes - couponDiscount)

    // Calculate carbon savings for metadata
    let carbonSaved = 0
    if (estimatedMiles && vehicle.fuel_types?.name) {
      const totalMiles = estimatedMiles * days
      const dieselEmission = totalMiles * 2.68 // kg CO2 per mile
      
      let actualEmission = dieselEmission
      const fuelType = vehicle.fuel_types.name.toLowerCase()
      
      if (fuelType.includes('electric')) {
        actualEmission = totalMiles * 0.4
      } else if (fuelType.includes('hybrid')) {
        actualEmission = dieselEmission * 0.55
      }
      
      carbonSaved = Math.max(0, dieselEmission - actualEmission)
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalTotal * 100), // Convert to cents
      currency: 'usd',
      receipt_email: customerEmail,
      metadata: {
        vehicleId: vehicleId.toString(),
        userId: user.id,
        sellerId: vehicle.seller_id,
        startDate,
        endDate,
        days: days.toString(),
        vehicleName: vehicle.name,
        customerName: customerName || '',
        subtotal: subtotal.toString(),
        platformFee: platformFee.toString(),
        taxes: taxes.toString(),
        couponCode: couponCode || '',
        couponDiscount: couponDiscount.toString(),
        carbonSaved: carbonSaved.toString(),
        estimatedMiles: estimatedMiles?.toString() || '0',
      },
      description: `Booking for ${vehicle.name} from ${startDate} to ${endDate}`,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      booking_summary: {
        subtotal,
        platform_fee: platformFee,
        taxes,
        coupon_discount: couponDiscount,
        total: finalTotal,
        carbon_saved: carbonSaved,
        coupon_details: couponDetails
      }
    })

  } catch (error) {
    console.error('Payment intent creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
