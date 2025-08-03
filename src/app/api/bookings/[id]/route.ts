import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { z } from 'zod'

const updateBookingSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'active', 'completed', 'cancelled', 'rejected']).optional(),
  payment_status: z.enum(['pending', 'paid', 'failed', 'refunded', 'partial_refund']).optional(),
  seller_notes: z.string().optional(),
  cancellation_reason: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        vehicles!inner (
          id,
          name,
          seller_id,
          vehicle_registration_number,
          vehicle_images (
            image_url,
            is_primary
          )
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
      .eq('id', id)
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .single()

    if (error) {
      console.error('Booking fetch error:', error)
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    return NextResponse.json({ booking })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateBookingSchema.parse(body)

    const { data: existingBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('id, buyer_id, seller_id, status')
      .eq('id', id)
      .single()

    if (fetchError || !existingBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    const isOwner = existingBooking.buyer_id === user.id || existingBooking.seller_id === user.id
    if (!isOwner) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const updateData: Record<string, unknown> = { ...validatedData }

    if (validatedData.status === 'confirmed' && existingBooking.status === 'pending') {
      updateData.confirmed_at = new Date().toISOString()
    }

    if (validatedData.status === 'cancelled') {
      updateData.cancelled_at = new Date().toISOString()
    }

    if (validatedData.status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Booking update error:', error)
      return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
    }

    return NextResponse.json({ booking })
  } catch (error) {
    console.error('API error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
