import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Truck, Weight } from 'lucide-react'
import { Database } from '@/types/database'

type Vehicle = Database['public']['Tables']['vehicles']['Row'] & {
  brands?: { name: string }
  models?: { name: string }
  vehicle_types?: { name: string }
  vehicle_categories?: { name: string }
  fuel_types?: { name: string }
}

interface VehicleDetailsCardProps {
  vehicle: Vehicle
}

export function VehicleDetailsCard({ vehicle }: VehicleDetailsCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl">{vehicle.name}</CardTitle>
          <Badge className={getStatusColor(vehicle.status || 'pending')}>
            {vehicle.status || 'pending'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-gray-700">{vehicle.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Brand</p>
              <p className="font-medium">{vehicle.brands?.name || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Year</p>
              <p className="font-medium">{vehicle.year}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{vehicle.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Weight className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Max Weight</p>
              <p className="font-medium">{vehicle.max_weight_capacity} kg</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Pricing</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Price per day:</span>
              <span className="font-semibold text-green-600">${vehicle.price_per_day}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
