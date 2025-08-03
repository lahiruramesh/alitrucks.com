import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('driving_license') as File
    const fullName = formData.get('full_name') as string
    const dateOfBirth = formData.get('date_of_birth') as string
    const phone = formData.get('phone') as string
    const address = formData.get('address') as string
    const licenseNumber = formData.get('license_number') as string
    const licenseExpiryDate = formData.get('license_expiry_date') as string

    // Validate required fields
    if (!file || !fullName || !dateOfBirth || !phone || !licenseNumber || !licenseExpiryDate) {
      return NextResponse.json(
        { error: 'All fields including driving license upload are required' }, 
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload JPEG, PNG, or PDF files only.' }, 
        { status: 400 }
      )
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' }, 
        { status: 400 }
      )
    }

    // Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-driving-license-${Date.now()}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('buyer-documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('File upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload document' }, 
        { status: 500 }
      )
    }

    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('buyer-documents')
      .getPublicUrl(fileName)

    // Create or update buyer profile
    const { error: profileError } = await supabase
      .from('buyer_profiles')
      .upsert({
        user_id: user.id,
        full_name: fullName,
        date_of_birth: dateOfBirth,
        phone: phone,
        address: address || null,
        license_number: licenseNumber,
        license_expiry_date: licenseExpiryDate,
        driving_license_url: urlData.publicUrl,
        verification_status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      return NextResponse.json(
        { error: 'Failed to create buyer profile' }, 
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      message: 'Buyer profile created successfully. Your documents are under review.',
      status: 'pending'
    })

  } catch (error) {
    console.error('Buyer registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
