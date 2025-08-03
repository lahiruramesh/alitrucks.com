import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import BookingWithStripe from '@/components/BookingWithStripe'

async function getVehicleData(id: string) {
  const supabase = await createClient()
  
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
    .eq('status', 'approved')
    .single()

  if (error) {
    console.error('Error fetching vehicle:', error)
    return null
  }

  return vehicle
}

export default async function VehiclePage({
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
          <div>
            <h1 className="text-3xl font-bold mb-4">{vehicle.name}</h1>
            <p className="text-gray-700 mb-6">{vehicle.description}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Brand:</span>
                <p className="font-medium">{vehicle.brands?.name}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Model:</span>
                <p className="font-medium">{vehicle.models?.name}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Year:</span>
                <p className="font-medium">{vehicle.year}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Location:</span>
                <p className="font-medium">{vehicle.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-green-600">
                    ${vehicle.price_per_day}
                  </p>
                  <p className="text-sm text-gray-600">per day</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <BookingWithStripe
                vehicle={{
                  id: vehicle.id,
                  name: vehicle.name,
                  price: vehicle.price_per_day || 0,
                  location: vehicle.location,
                  seller_id: vehicle.seller_id
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
