import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const supabase = await createClient()

    // Extract search parameters
    const location = searchParams.get('location') || ''
    const ecoFriendlyOnly = searchParams.get('ecoFriendlyOnly') === 'true'
    const priceRange = searchParams.get('priceRange') ? JSON.parse(searchParams.get('priceRange')!) : [0, 500]

    // Build the basic query
    let query = supabase
      .from('vehicles')
      .select(`
        *,
        brands(name),
        models(name),
        fuel_types(name),
        vehicle_types(name),
        user_profiles!vehicles_seller_id_fkey(first_name, last_name, email)
      `)
      .eq('status', 'active')

    // Apply filters
    if (location) {
      query = query.ilike('location', `%${location}%`)
    }

    if (priceRange[0] > 0 || priceRange[1] < 500) {
      query = query.gte('price_per_day', priceRange[0]).lte('price_per_day', priceRange[1])
    }

    // Execute query
    const { data: vehicles, error } = await query.limit(20)

    if (error) {
      console.error('Error searching vehicles:', error)
      return NextResponse.json({ error: 'Failed to search vehicles' }, { status: 500 })
    }

    // Process and enhance vehicle data
    const enhancedVehicles = vehicles?.map(vehicle => {
      // Calculate average rating (placeholder for now)
      const rating = 4.2 + Math.random() * 0.8 // Random rating between 4.2-5.0
      const totalReviews = Math.floor(Math.random() * 50) + 5 // Random reviews 5-55

      // Get brand and model names
      const brandName = vehicle.brands?.name || 'Unknown'
      const modelName = vehicle.models?.name || 'Model'
      const fuelTypeName = vehicle.fuel_types?.name || 'Unknown'
      const vehicleTypeName = vehicle.vehicle_types?.name || 'Truck'

      // Add owner name
      const ownerProfile = vehicle.user_profiles
      const ownerName = ownerProfile && !Array.isArray(ownerProfile) && typeof ownerProfile === 'object'
        ? `${(ownerProfile as { first_name?: string; last_name?: string }).first_name || ''} ${(ownerProfile as { first_name?: string; last_name?: string }).last_name || ''}`.trim()
        : ownerProfile && Array.isArray(ownerProfile) && ownerProfile.length > 0
          ? `${ownerProfile[0].first_name || ''} ${ownerProfile[0].last_name || ''}`.trim()
          : 'Owner'

      // Check availability (simplified)
      const availability = true

      // Add default features
      const defaultFeatures = vehicle.key_features || ['GPS Navigation', 'Insurance Included', 'Clean Vehicle']

      // Calculate capacity in tons (convert from kg if needed)
      const capacityTons = vehicle.max_weight_capacity 
        ? vehicle.max_weight_capacity / 1000 
        : Math.random() * 10 + 1

      return {
        id: vehicle.id,
        make: brandName,
        model: modelName,
        year: vehicle.year,
        vehicle_type: vehicleTypeName,
        fuel_type: fuelTypeName,
        capacity_tons: Math.round(capacityTons * 10) / 10,
        daily_rate: vehicle.price_per_day || 0,
        location: vehicle.location,
        availability,
        rating: Math.round(rating * 10) / 10,
        total_reviews: totalReviews,
        features: Array.isArray(defaultFeatures) ? defaultFeatures : [defaultFeatures].filter(Boolean),
        images: [`/api/placeholder/400/300?text=${brandName}+${modelName}`],
        owner_name: ownerName || 'Owner',
        name: vehicle.name,
        description: vehicle.description
      }
    }).filter(vehicle => {
      // Apply eco-friendly filter
      if (ecoFriendlyOnly) {
        return vehicle.fuel_type.toLowerCase().includes('electric') || 
               vehicle.fuel_type.toLowerCase().includes('hybrid')
      }
      return true
    }) || []

    // Sort results
    const sortBy = searchParams.get('sortBy') || 'price-low'
    enhancedVehicles.sort((a, b) => {
      switch (sortBy) {
        case 'price-high':
          return (b.daily_rate || 0) - (a.daily_rate || 0)
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'eco-friendly':
          const aEco = a.fuel_type.toLowerCase().includes('electric') ? 2 : 
                      a.fuel_type.toLowerCase().includes('hybrid') ? 1 : 0
          const bEco = b.fuel_type.toLowerCase().includes('electric') ? 2 : 
                      b.fuel_type.toLowerCase().includes('hybrid') ? 1 : 0
          return bEco - aEco
        case 'price-low':
        default:
          return (a.daily_rate || 0) - (b.daily_rate || 0)
      }
    })

    return NextResponse.json({
      vehicles: enhancedVehicles,
      total: enhancedVehicles.length,
      filters: {
        location,
        ecoFriendlyOnly,
        priceRange
      }
    })

  } catch (error) {
    console.error('Error in vehicle search:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
