import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import BookingWithStripeWrapper from '@/components/BookingWithStripeWrapper'
import TruckDetailGallery from '@/components/TruckDetailGallery'
import ReviewsSection from '@/components/ReviewsSection'
import PoliciesDialog from '@/components/PoliciesDialog'
import { Leaf, Zap, Fuel, Star, MapPin, Calendar, Shield, Users } from 'lucide-react'

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
      ),
      user_profiles!vehicles_seller_id_fkey (
        full_name,
        avatar_url
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

async function getRelatedVehicles(vehicleId: number, categoryId?: number) {
  const supabase = await createClient()
  
  const { data: vehicles } = await supabase
    .from('vehicles')
    .select(`
      id,
      name,
      price_per_day,
      location,
      fuel_type_id,
      vehicle_images (
        image_url,
        is_primary
      ),
      fuel_types (
        name
      )
    `)
    .neq('id', vehicleId)
    .eq('status', 'approved')
    .eq('category_id', categoryId || 1)
    .limit(3)

  return vehicles || []
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

  const relatedVehicles = await getRelatedVehicles(vehicle.id, vehicle.vehicle_category_id || undefined)
  
  // Calculate environmental score
  const getEnvironmentalScore = (fuelType: string | undefined) => {
    switch (fuelType?.toLowerCase()) {
      case 'electric': return { score: 'A+', color: 'bg-green-600', label: 'Excellent' }
      case 'hybrid': return { score: 'A', color: 'bg-green-500', label: 'Very Good' }
      case 'natural gas': return { score: 'B+', color: 'bg-yellow-500', label: 'Good' }
      case 'diesel': return { score: 'C', color: 'bg-orange-500', label: 'Average' }
      default: return { score: 'C', color: 'bg-gray-500', label: 'Standard' }
    }
  }

  const envScore = getEnvironmentalScore(vehicle.fuel_types?.name)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle Gallery */}
            <Card>
              <CardContent className="p-0">
                <TruckDetailGallery 
                  images={vehicle.vehicle_images?.map(img => img.image_url) || ['/api/placeholder/800/600']} 
                />
              </CardContent>
            </Card>

            {/* Vehicle Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{vehicle.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current text-yellow-500" />
                        4.8 (124 reviews)
                      </Badge>
                      <Badge className={`${envScore.color} text-white`}>
                        <Leaf className="w-3 h-3 mr-1" />
                        {envScore.score} {envScore.label}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Hosted by</p>
                    <p className="font-medium">
                      {vehicle.user_profiles?.full_name || 'Vehicle Owner'}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-6">{vehicle.description}</p>
                
                {/* Vehicle Specifications */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Fuel className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-xs text-gray-500">Fuel Type</p>
                    <p className="font-medium">{vehicle.fuel_types?.name}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Users className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <p className="text-xs text-gray-500">Payload</p>
                    <p className="font-medium">{vehicle.cargo_volume || 2000} L</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <p className="text-xs text-gray-500">Year</p>
                    <p className="font-medium">{vehicle.year}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-6 h-6 mx-auto mb-2 text-red-600" />
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-medium">{vehicle.location}</p>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Vehicle Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Brand:</span>
                      <span className="ml-2 font-medium">{vehicle.brands?.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Model:</span>
                      <span className="ml-2 font-medium">{vehicle.models?.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <span className="ml-2 font-medium">{vehicle.vehicle_types?.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <span className="ml-2 font-medium">{vehicle.vehicle_categories?.name}</span>
                    </div>
                  </div>
                </div>

                {/* Environmental Impact */}
                <div className="bg-green-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-800">Environmental Impact</h3>
                  </div>
                  <p className="text-sm text-green-700 mb-2">
                    This {vehicle.fuel_types?.name?.toLowerCase()} vehicle helps reduce carbon emissions.
                  </p>
                  {vehicle.fuel_types?.name?.toLowerCase() === 'electric' && (
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        Zero emissions
                      </span>
                      <span>~89% less CO₂ than diesel</span>
                    </div>
                  )}
                </div>

                {/* Policies */}
                <div className="border-t pt-4">
                  <PoliciesDialog policyType="cancellation" />
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <ReviewsSection rating={4.8} reviews={124} />

            {/* Related Vehicles */}
            {relatedVehicles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Similar Vehicles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {relatedVehicles.map((relatedVehicle) => (
                      <Card key={relatedVehicle.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden">
                            {relatedVehicle.vehicle_images?.[0]?.image_url ? (
                              <Image
                                src={relatedVehicle.vehicle_images[0].image_url} 
                                alt={relatedVehicle.name}
                                width={300}
                                height={200}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Shield className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <h4 className="font-medium mb-1">{relatedVehicle.name}</h4>
                          <p className="text-sm text-gray-500 mb-2">{relatedVehicle.location}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-green-600">
                              ${relatedVehicle.price_per_day}/day
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {relatedVehicle.fuel_types?.name}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-green-600">
                      ${vehicle.price_per_day}
                    </p>
                    <p className="text-sm text-gray-600">per day</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current text-yellow-500" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                    <p className="text-xs text-gray-500">124 reviews</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <BookingWithStripeWrapper
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
    </div>
  )
}
