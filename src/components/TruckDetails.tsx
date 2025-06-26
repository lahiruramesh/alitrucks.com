import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Star, Shield, Award, User, Clock, Calendar } from 'lucide-react'

interface TruckDetailsProps {
  truck: {
    name: string
    description: string
    features: string[]
    specifications: Record<string, string>
    amenities: string[]
    host: {
      name: string
      rating: number
      responseTime: string
      joinedDate: string
    }
  }
}

export default function TruckDetails({ truck }: TruckDetailsProps) {
  return (
    <div className="space-y-8">
      {/* Description */}
      <div>
        <h2 className="text-2xl font-bold mb-4">About this truck</h2>
        <p className="text-gray-600 leading-relaxed">
          {truck.description}
        </p>
      </div>

      {/* Features */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Key Features</h3>
        <div className="flex flex-wrap gap-2">
          {truck.features.map((feature) => (
            <Badge key={feature} variant="secondary" className="px-3 py-1">
              {feature}
            </Badge>
          ))}
        </div>
      </div>

      {/* Specifications */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Specifications</h3>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(truck.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Amenities */}
      <div>
        <h3 className="text-xl font-semibold mb-4">What this truck offers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {truck.amenities.map((amenity) => (
            <div key={amenity} className="flex items-center">
              <Shield className="w-4 h-4 text-green-500 mr-3" />
              <span className="text-gray-700">{amenity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Host Information */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Meet your host</h3>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF385C] to-[#E02748] rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold">{truck.host.name}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    {truck.host.rating} rating
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Responds {truck.host.responseTime}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Joined {truck.host.joinedDate}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="secondary">
                    <Award className="w-3 h-3 mr-1" />
                    Superhost
                  </Badge>
                  <Badge variant="secondary">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
