import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get notifications for this admin
    const { data: notifications, error } = await supabase
      .from('admin_notifications')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, title, message, data } = body

    const supabase = await createClient()
    
    // Get all admin users
    const { data: admins, error: adminError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('role', 'admin')

    if (adminError) {
      return NextResponse.json({ error: adminError.message }, { status: 500 })
    }

    // Create notifications for all admins
    const notifications = admins.map((admin: { id: string }) => ({
      user_id: admin.id,
      type,
      title,
      message,
      data,
      read: false
    }))

    const { error: insertError } = await supabase
      .from('admin_notifications')
      .insert(notifications)

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error creating notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { notificationId } = body

    const supabase = await createClient()
    
    // Get the current user
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Mark notification as read
    const { error } = await supabase
      .from('admin_notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .eq('user_id', session.user.id) // Ensure user can only mark their own notifications

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
