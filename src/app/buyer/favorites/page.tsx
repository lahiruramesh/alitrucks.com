import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, MapPin, Star, Truck } from 'lucide-react'

export default function BuyerFavoritesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Favorite Trucks</h1>
          <p className="text-gray-600 mt-1">Your saved vehicles for quick booking</p>
        </div>
        <Button>
          <MapPin className="w-4 h-4 mr-2" />
          Browse More Trucks
        </Button>
      </div>

      {/* Favorites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Favorite Vehicle 1 */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <div className="aspect-video bg-gray-200 rounded-t-lg relative">
              <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm">
                <Heart className="w-4 h-4 text-red-500 fill-current" />
              </div>
              <div className="flex items-center justify-center h-full">
                <Truck className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">Tesla Semi Electric Truck</h3>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm">4.9</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-3">San Francisco, CA</p>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xl font-bold">$249</span>
                  <span className="text-gray-500">/day</span>
                </div>
                <Button size="sm">Book Now</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Favorite Vehicle 2 */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <div className="aspect-video bg-gray-200 rounded-t-lg relative">
              <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm">
                <Heart className="w-4 h-4 text-red-500 fill-current" />
              </div>
              <div className="flex items-center justify-center h-full">
                <Truck className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">Ford F-150 Lightning</h3>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm">4.7</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-3">Los Angeles, CA</p>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xl font-bold">$199</span>
                  <span className="text-gray-500">/day</span>
                </div>
                <Button size="sm">Book Now</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Favorite Vehicle 3 */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <div className="aspect-video bg-gray-200 rounded-t-lg relative">
              <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm">
                <Heart className="w-4 h-4 text-red-500 fill-current" />
              </div>
              <div className="flex items-center justify-center h-full">
                <Truck className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">Rivian R1T Electric Pickup</h3>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm">4.8</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-3">Seattle, WA</p>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xl font-bold">$179</span>
                  <span className="text-gray-500">/day</span>
                </div>
                <Button size="sm">Book Now</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Empty State (if no favorites) */}
      <Card className="text-center py-12">
        <CardContent>
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-500 mb-4">
            Start exploring trucks and save your favorites for quick booking.
          </p>
          <Button>
            <MapPin className="w-4 h-4 mr-2" />
            Browse Trucks
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
