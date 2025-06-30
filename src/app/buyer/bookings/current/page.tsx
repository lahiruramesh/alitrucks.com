import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Clock } from 'lucide-react'

export default function BuyerCurrentBookingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Current Bookings</h1>
          <p className="text-gray-600 mt-1">Manage your active and upcoming rentals</p>
        </div>
        <Button>
          <MapPin className="w-4 h-4 mr-2" />
          Find More Trucks
        </Button>
      </div>

      {/* Active Bookings */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Active Rental
            </CardTitle>
            <CardDescription>
              Currently rented vehicle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start p-4 border rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Tesla Semi Electric Truck</h3>
                <p className="text-gray-600">Dec 15-17, 2024 • 3 days</p>
                <p className="text-gray-500 text-sm">San Francisco, CA</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Active
                  </span>
                  <span className="text-sm text-gray-500">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Ends in 2 days
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">$750</p>
                <p className="text-sm text-gray-500">Total</p>
                <div className="mt-3 space-x-2">
                  <Button variant="outline" size="sm">Contact Seller</Button>
                  <Button size="sm">Extend Rental</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Upcoming Bookings
            </CardTitle>
            <CardDescription>
              Confirmed future rentals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-start p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">Ford F-150 Lightning</h3>
                  <p className="text-gray-600">Dec 22-24, 2024 • 3 days</p>
                  <p className="text-gray-500 text-sm">Los Angeles, CA</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Confirmed
                    </span>
                    <span className="text-sm text-gray-500">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Starts in 7 days
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">$597</p>
                  <p className="text-sm text-gray-500">Total</p>
                  <div className="mt-3 space-x-2">
                    <Button variant="outline" size="sm">Modify</Button>
                    <Button variant="destructive" size="sm">Cancel</Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
