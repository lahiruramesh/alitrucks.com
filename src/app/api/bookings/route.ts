import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { z } from 'zod'

const createBookingSchema = z.object({
  vehicle_id: z.number(),
  start_date: z.string(),
  end_date: z.string(),
  pickup_time: z.string().optional().default('09:00:00'),
  return_time: z.string().optional().default('18:00:00'),
  pickup_location: z.string(),
  return_location: z.string().optional(),
  special_requests: z.string().optional(),
  renter_notes: z.string().optional(),
  renter_phone: z.string().optional(),
  renter_email: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createBookingSchema.parse(body)

    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .select('id, seller_id, price_per_day, status')
      .eq('id', validatedData.vehicle_id)
      .eq('status', 'approved')
      .single()

    if (vehicleError || !vehicle) {
      return NextResponse.json({ error: 'Vehicle not found or not available' }, { status: 404 })
    }

    if (vehicle.seller_id === user.id) {
      return NextResponse.json({ error: 'Cannot book your own vehicle' }, { status: 400 })
    }

    const startDate = new Date(validatedData.start_date)
    const endDate = new Date(validatedData.end_date)
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (totalDays <= 0) {
      return NextResponse.json({ error: 'Invalid date range' }, { status: 400 })
    }

    if (!vehicle.price_per_day) {
      return NextResponse.json({ error: 'Vehicle price not set' }, { status: 400 })
    }

    const subtotal = vehicle.price_per_day * totalDays
    const serviceFee = subtotal * 0.1
    const taxes = subtotal * 0.08
    const totalAmount = subtotal + serviceFee + taxes

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        vehicle_id: validatedData.vehicle_id,
        buyer_id: user.id,
        seller_id: vehicle.seller_id,
        start_date: validatedData.start_date,
        end_date: validatedData.end_date,
        pickup_time: validatedData.pickup_time,
        return_time: validatedData.return_time,
        pickup_location: validatedData.pickup_location,
        return_location: validatedData.return_location,
        price_per_day: vehicle.price_per_day,
        total_days: totalDays,
        subtotal: subtotal,
        service_fee: serviceFee,
        taxes: taxes,
        total_amount: totalAmount,
        special_requests: validatedData.special_requests,
        renter_notes: validatedData.renter_notes,
        renter_phone: validatedData.renter_phone,
        renter_email: validatedData.renter_email,
        status: 'pending',
        payment_status: 'pending'
      })
      .select()
      .single()

    if (bookingError) {
      console.error('Booking creation error:', bookingError)
      return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
    }

    return NextResponse.json({ booking }, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const status = searchParams.get('status')

    let query = supabase
      .from('bookings')
      .select(`
        *,
        vehicles!inner (
          id,
          name,
          seller_id,
          vehicle_registration_number
        ),
        buyer:user_profiles!bookings_buyer_id_fkey (
          id,
          full_name,
          email,
          phone
        ),
        seller:user_profiles!bookings_seller_id_fkey (
          id,
          full_name,
          email,
          phone
        )
      `)

    if (role === 'buyer') {
      query = query.eq('buyer_id', user.id)
    } else if (role === 'seller') {
      query = query.eq('seller_id', user.id)
    } else {
      query = query.or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    }

    if (status && ['pending', 'confirmed', 'active', 'completed', 'cancelled', 'rejected'].includes(status)) {
      query = query.eq('status', status as 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'rejected')
    }

    query = query.order('created_at', { ascending: false })

    const { data: bookings, error } = await query

    if (error) {
      console.error('Bookings fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
    }

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
