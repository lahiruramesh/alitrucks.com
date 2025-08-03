import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { code, subtotal } = body

    if (!code || !subtotal) {
      return NextResponse.json({ 
        error: 'Missing required fields: code, subtotal' 
      }, { status: 400 })
    }

    // Find the coupon
    const { data: coupon, error: couponError } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single()

    if (couponError || !coupon) {
      return NextResponse.json({ 
        error: 'Invalid coupon code',
        valid: false
      }, { status: 400 })
    }

    // Check if coupon is currently valid
    const now = new Date()
    const validFrom = coupon.valid_from ? new Date(coupon.valid_from) : new Date()
    const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null

    if (coupon.valid_from && now < validFrom) {
      return NextResponse.json({ 
        error: 'Coupon is not yet valid',
        valid: false
      }, { status: 400 })
    }

    if (validUntil && now > validUntil) {
      return NextResponse.json({ 
        error: 'Coupon has expired',
        valid: false
      }, { status: 400 })
    }

    // Check minimum amount
    const minimumAmount = coupon.minimum_amount || 0
    if (subtotal < minimumAmount) {
      return NextResponse.json({ 
        error: `Minimum order amount is $${minimumAmount}`,
        valid: false
      }, { status: 400 })
    }

    // Check usage limit
    if (coupon.usage_limit) {
      const usedCount = coupon.used_count || 0
      if (usedCount >= coupon.usage_limit) {
        return NextResponse.json({ 
          error: 'Coupon has reached its usage limit',
          valid: false
        }, { status: 400 })
      }
    }

    // Check if user has already used this coupon (if single-use per user)
    const { data: userUsage } = await supabase
      .from('coupon_usage')
      .select('id')
      .eq('coupon_id', coupon.id)
      .eq('user_id', session.user.id)
      .single()

    if (userUsage) {
      return NextResponse.json({ 
        error: 'You have already used this coupon',
        valid: false
      }, { status: 400 })
    }

    // Calculate discount
    let discountAmount = 0
    if (coupon.discount_type === 'percentage') {
      discountAmount = (subtotal * coupon.discount_value) / 100
      if (coupon.maximum_discount) {
        discountAmount = Math.min(discountAmount, coupon.maximum_discount)
      }
    } else if (coupon.discount_type === 'fixed_amount') {
      discountAmount = Math.min(coupon.discount_value, subtotal)
    }

    discountAmount = Math.round(discountAmount * 100) / 100 // Round to 2 decimal places

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        name: coupon.name,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value
      },
      discount_amount: discountAmount,
      final_amount: Math.max(0, subtotal - discountAmount)
    })

  } catch (error) {
    console.error('Error in coupon validation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
