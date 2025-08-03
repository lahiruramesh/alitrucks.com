import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // Get coupons with usage statistics
    const { data: coupons, error } = await supabase
      .from('coupons')
      .select(`
        *,
        coupon_usage(
          id,
          discount_amount,
          used_at,
          user_id
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching coupons:', error)
      return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 })
    }

    // Calculate usage statistics
    const enhancedCoupons = coupons.map(coupon => ({
      ...coupon,
      usage_stats: {
        total_used: coupon.coupon_usage?.length || 0,
        total_discount_given: Array.isArray(coupon.coupon_usage) 
          ? coupon.coupon_usage.reduce((sum: number, usage: { discount_amount: number }) => 
              sum + usage.discount_amount, 0) 
          : 0,
        remaining_uses: coupon.usage_limit ? Math.max(0, coupon.usage_limit - (coupon.coupon_usage?.length || 0)) : null
      }
    }))

    return NextResponse.json({ 
      coupons: enhancedCoupons,
      pagination: {
        page,
        limit,
        total: enhancedCoupons.length
      }
    })
  } catch (error) {
    console.error('Error in coupons GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const {
      code,
      name,
      description,
      discount_type,
      discount_value,
      minimum_amount,
      maximum_discount,
      usage_limit,
      valid_from,
      valid_until
    } = body

    // Validate required fields
    if (!code || !name || !discount_type || discount_value === undefined) {
      return NextResponse.json({ 
        error: 'Missing required fields: code, name, discount_type, discount_value' 
      }, { status: 400 })
    }

    // Check if coupon code already exists
    const { data: existingCoupon } = await supabase
      .from('coupons')
      .select('id')
      .eq('code', code.toUpperCase())
      .single()

    if (existingCoupon) {
      return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 })
    }

    // Create new coupon
    const { data: newCoupon, error } = await supabase
      .from('coupons')
      .insert({
        code: code.toUpperCase(),
        name,
        description,
        discount_type,
        discount_value: parseFloat(discount_value),
        minimum_amount: minimum_amount ? parseFloat(minimum_amount) : 0,
        maximum_discount: maximum_discount ? parseFloat(maximum_discount) : null,
        usage_limit: usage_limit ? parseInt(usage_limit) : null,
        valid_from: valid_from || new Date().toISOString(),
        valid_until: valid_until || null,
        created_by: session.user.id
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating coupon:', error)
      return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Coupon created successfully',
      coupon: newCoupon
    })
  } catch (error) {
    console.error('Error in coupons POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
