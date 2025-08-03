'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { 
  MapPin, 
  Fuel, 
  Star, 
  Leaf, 
  Zap, 
  Calendar,
  Weight,
  Truck
} from 'lucide-react'

interface Vehicle {
  id: number
  make: string
  model: string
  year: number
  vehicle_type: string
  fuel_type: string
  capacity_tons: number
  daily_rate: number
  location: string
  availability: boolean
  rating: number
  total_reviews: number
  features: string[]
  images: string[]
  owner_name: string
}

interface VehicleSearchResultsProps {
  results: Vehicle[]
  loading: boolean
  filters: {
    location: string
    startDate: string
    endDate: string
    fuelType: string
    ecoFriendlyOnly: boolean
    priceRange: number[]
    capacity: number[]
    features: string[]
  }
  estimatedMiles: number
}

export default function VehicleSearchResults({ 
  results, 
  loading, 
  filters, 
  estimatedMiles 
}: VehicleSearchResultsProps) {
  
  const calculateCarbonSavings = (vehicle: Vehicle) => {
    const days = filters.startDate && filters.endDate 
      ? Math.ceil((new Date(filters.endDate).getTime() - new Date(filters.startDate).getTime()) / (1000 * 60 * 60 * 24))
      : 1
    
    const totalMiles = estimatedMiles * days
    const dieselEmission = totalMiles * 2.68 // kg CO2 per mile
    
    let actualEmission = dieselEmission
    let savingsPercentage = 0
    
    switch (vehicle.fuel_type) {
      case 'electric':
        actualEmission = totalMiles * 0.4
        savingsPercentage = 85
        break
      case 'hybrid':
        actualEmission = dieselEmission * 0.55
        savingsPercentage = 45
        break
      default:
        actualEmission = dieselEmission
        savingsPercentage = 0
    }
    
    return {
      co2Saved: Math.max(0, dieselEmission - actualEmission),
      savingsPercentage,
      totalMiles
    }
  }

  const getFuelIcon = (fuelType: string) => {
    switch (fuelType) {
      case 'electric': return <Zap className="w-4 h-4 text-green-600" />
      case 'hybrid': return <div className="w-4 h-4 text-blue-600">🔋</div>
      default: return <Fuel className="w-4 h-4 text-gray-600" />
    }
  }

  const getFuelBadge = (fuelType: string) => {
    switch (fuelType) {
      case 'electric': 
        return <Badge className="bg-green-100 text-green-800 border-green-200">⚡ Electric</Badge>
      case 'hybrid': 
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">🔋 Hybrid</Badge>
      case 'diesel': 
        return <Badge variant="outline">⛽ Diesel</Badge>
      default: 
        return <Badge variant="outline">{fuelType}</Badge>
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p>Searching for eco-friendly trucks...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <Truck className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No trucks found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or location
            </p>
            <Button variant="outline">
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {results.length} truck{results.length !== 1 ? 's' : ''} available
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <select className="border rounded px-2 py-1 text-sm">
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="eco-friendly">Most Eco-Friendly</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {results.map((vehicle) => {
          const carbonData = calculateCarbonSavings(vehicle)
          
          return (
            <Card key={vehicle.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
                  {/* Vehicle Image */}
                  <div className="lg:col-span-1">
                    <div className="h-48 lg:h-full bg-gray-200 relative">
                      {vehicle.images && vehicle.images.length > 0 ? (
                        <Image 
                          src={vehicle.images[0]} 
                          alt={`${vehicle.make} ${vehicle.model}`}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Truck className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      {vehicle.fuel_type === 'electric' && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <Leaf className="w-3 h-3 mr-1" />
                            Eco-Friendly
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="lg:col-span-2 p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </h3>
                          <div className="flex items-center">
                            {getFuelIcon(vehicle.fuel_type)}
                            <span className="ml-1 text-sm">{vehicle.fuel_type}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {vehicle.location}
                          </div>
                          <div className="flex items-center">
                            <Weight className="w-4 h-4 mr-1" />
                            {vehicle.capacity_tons} tons
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1 fill-current text-yellow-500" />
                            {vehicle.rating.toFixed(1)} ({vehicle.total_reviews} reviews)
                          </div>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2">
                        {getFuelBadge(vehicle.fuel_type)}
                        <Badge variant="outline">{vehicle.vehicle_type.replace('_', ' ')}</Badge>
                        {vehicle.availability && (
                          <Badge className="bg-green-100 text-green-800">Available</Badge>
                        )}
                      </div>

                      {/* Carbon Impact */}
                      {carbonData.savingsPercentage > 0 && (
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Leaf className="w-5 h-5 text-green-600 mr-2" />
                              <div>
                                <div className="font-semibold text-green-800">
                                  Save {carbonData.co2Saved.toFixed(1)} kg CO₂
                                </div>
                                <div className="text-sm text-green-600">
                                  {carbonData.savingsPercentage}% less emissions vs diesel
                                </div>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-green-300">
                              -{carbonData.savingsPercentage}% CO₂
                            </Badge>
                          </div>
                        </div>
                      )}

                      {/* Features */}
                      {vehicle.features && vehicle.features.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Features</h4>
                          <div className="flex flex-wrap gap-1">
                            {vehicle.features.slice(0, 4).map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {vehicle.features.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{vehicle.features.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing & Action */}
                  <div className="lg:col-span-1 p-6 bg-gray-50 flex flex-col justify-between">
                    <div>
                      <div className="text-3xl font-bold mb-1">
                        {formatCurrency(vehicle.daily_rate)}
                      </div>
                      <div className="text-sm text-muted-foreground mb-4">per day</div>
                      
                      {filters.startDate && filters.endDate && (
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span>Total days:</span>
                            <span>{Math.ceil((new Date(filters.endDate).getTime() - new Date(filters.startDate).getTime()) / (1000 * 60 * 60 * 24))}</span>
                          </div>
                          <div className="flex justify-between font-semibold">
                            <span>Total:</span>
                            <span>{formatCurrency(vehicle.daily_rate * Math.ceil((new Date(filters.endDate).getTime() - new Date(filters.startDate).getTime()) / (1000 * 60 * 60 * 24)))}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => window.location.href = `/truck/${vehicle.id}`}
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => window.location.href = `/truck/${vehicle.id}?book=true`}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
