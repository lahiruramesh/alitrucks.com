import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET() {
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

    // Get all platform settings
    const { data: settings, error } = await supabase
      .from('platform_settings')
      .select('*')
      .order('key')

    if (error) {
      console.error('Error fetching platform settings:', error)
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }

    // Transform settings into a more usable format
    const settingsObject = settings.reduce((acc, setting) => {
      acc[setting.key] = {
        value: setting.value,
        description: setting.description,
        is_active: setting.is_active,
        updated_at: setting.updated_at
      }
      return acc
    }, {} as Record<string, {
      value: unknown
      description: string | null
      is_active: boolean | null
      updated_at: string | null
    }>)

    return NextResponse.json({ settings: settingsObject })
  } catch (error) {
    console.error('Error in platform settings GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
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
    const { settings } = body

    // Update each setting
    const updates = []
    for (const [key, data] of Object.entries(settings)) {
      const settingData = data as { value: unknown; is_active?: boolean }
      
      const { error } = await supabase
        .from('platform_settings')
        .update({
          value: settingData.value as string | number | boolean,
          is_active: settingData.is_active ?? true,
          updated_at: new Date().toISOString()
        })
        .eq('key', key)

      if (error) {
        console.error(`Error updating setting ${key}:`, error)
        return NextResponse.json({ error: `Failed to update ${key}` }, { status: 500 })
      }

      updates.push(key)
    }

    return NextResponse.json({ 
      message: 'Settings updated successfully',
      updated: updates
    })
  } catch (error) {
    console.error('Error in platform settings PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
