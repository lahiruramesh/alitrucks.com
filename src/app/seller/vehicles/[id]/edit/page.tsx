import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { VehicleEditForm } from '@/components/seller/VehicleEditForm'

async function getVehicleData(id: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  const { data: vehicle, error } = await supabase
    .from('vehicles')
    .select(`
      *,
      brands (
        id,
        name
      ),
      models (
        id,
        name
      ),
      vehicle_types (
        id,
        name
      ),
      vehicle_categories (
        id,
        name
      ),
      fuel_types (
        id,
        name
      ),
      vehicle_images (
        id,
        image_url,
        is_primary,
        display_order,
        alt_text
      )
    `)
    .eq('id', parseInt(id))
    .eq('seller_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching vehicle:', error)
    return null
  }

  return vehicle
}

async function getFormData() {
  const supabase = await createClient()
  
  // Fetch all the dropdown options
  const [brandsResponse, modelsResponse, vehicleTypesResponse, vehicleCategoriesResponse, fuelTypesResponse] = await Promise.all([
    supabase.from('brands').select('id, name').order('name'),
    supabase.from('models').select('id, name, brand_id').order('name'),
    supabase.from('vehicle_types').select('id, name').order('name'),
    supabase.from('vehicle_categories').select('id, name').order('name'),
    supabase.from('fuel_types').select('id, name').order('name'),
  ])

  return {
    brands: brandsResponse.data || [],
    models: modelsResponse.data || [],
    vehicleTypes: vehicleTypesResponse.data || [],
    vehicleCategories: vehicleCategoriesResponse.data || [],
    fuelTypes: fuelTypesResponse.data || [],
  }
}

export default async function SellerVehicleEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [vehicle, formData] = await Promise.all([
    getVehicleData(id),
    getFormData(),
  ])

  if (!vehicle) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Vehicle</h1>
        <p className="text-gray-600 mt-1">Update your vehicle information</p>
      </div>

      <VehicleEditForm 
        vehicle={{
          ...vehicle,
          brands: vehicle.brands || undefined,
          models: vehicle.models || undefined,
          vehicle_types: vehicle.vehicle_types || undefined,
          vehicle_categories: vehicle.vehicle_categories || undefined,
          fuel_types: vehicle.fuel_types || undefined,
          vehicle_images: vehicle.vehicle_images || undefined,
        }}
        formData={formData}
      />
    </div>
  )
}
