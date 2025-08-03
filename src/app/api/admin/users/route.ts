import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authorization = request.headers.get('authorization')
    if (!authorization) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Extract token
    const token = authorization.replace('Bearer ', '')
    
    // Verify the user with the token
    const { data: { user }, error: tokenError } = await supabaseAdmin.auth.getUser(token)
    
    if (tokenError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get the current user's profile to check if they're an admin
    const { data: profile, error: userProfileError } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userProfileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Admin role required.' }, { status: 403 })
    }

    // Get query parameters for pagination and filtering
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const role = searchParams.get('role') // Filter by role
    const search = searchParams.get('search') // Search by name or email
    
    const offset = (page - 1) * limit

    // Build query
    let query = supabaseAdmin
      .from('user_profiles')
      .select(`
        id,
        full_name,
        email,
        phone,
        role,
        status,
        created_at,
        updated_at
      `)

    // Apply filters
    if (role && role !== 'all') {
      query = query.eq('role', role)
    }

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    // Get total count for pagination
    const { count } = await supabaseAdmin
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })

    // Get paginated results
    const { data: users, error: usersError } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (usersError) {
      console.error('Error fetching users:', usersError)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    return NextResponse.json({
      users: users || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error: unknown) {
    console.error('Error in users GET:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authorization = request.headers.get('authorization')
    if (!authorization) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Extract token
    const token = authorization.replace('Bearer ', '')
    
    // Verify the user with the token
    const { data: { user }, error: tokenError } = await supabaseAdmin.auth.getUser(token)
    
    if (tokenError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get the current user's profile to check if they're an admin
    const { data: profile, error: userProfileError } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userProfileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Admin role required.' }, { status: 403 })
    }

    const body = await request.json()
    const { email, password, full_name, role, phone } = body

    // Validate required fields
    if (!email || !password || !full_name || !role) {
      return NextResponse.json({ 
        error: 'Missing required fields: email, password, full_name, and role are required' 
      }, { status: 400 })
    }

    // Create auth user using admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for admin-created users
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    // Create user profile
    const { data: profileData, error: createProfileError } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        email,
        full_name,
        role,
        phone: phone || null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (createProfileError) {
      // If profile creation fails, delete the auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: createProfileError.message }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      user: profileData,
      message: 'User created successfully'
    })

  } catch (error: unknown) {
    console.error('Error creating user:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 })
  }
}
