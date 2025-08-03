import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { VehicleDetailsCard } from '@/components/seller/VehicleDetailsCard'
import { VehicleImagesGallery } from '@/components/seller/VehicleImagesGallery'
import { VehicleActions } from '@/components/seller/VehicleActions'

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
        name
      ),
      models (
        name
      ),
      vehicle_types (
        name
      ),
      vehicle_categories (
        name
      ),
      fuel_types (
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

export default async function SellerVehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const vehicle = await getVehicleData(id)

  if (!vehicle) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <VehicleImagesGallery 
            images={vehicle.vehicle_images || []}
            vehicleName={vehicle.name}
          />
          
          <VehicleDetailsCard vehicle={{
            ...vehicle,
            brands: vehicle.brands || undefined,
            models: vehicle.models || undefined,
            vehicle_types: vehicle.vehicle_types || undefined,
            vehicle_categories: vehicle.vehicle_categories || undefined,
            fuel_types: vehicle.fuel_types || undefined,
          }} />
        </div>
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <VehicleActions vehicle={vehicle} />
        </div>
      </div>
    </div>
  )
}
