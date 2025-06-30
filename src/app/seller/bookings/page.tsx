import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, MessageSquare, Eye } from 'lucide-react'

export default function SellerBookingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600 mt-1">Manage rental requests and active bookings</p>
        </div>
        <Button>
          <Eye className="w-4 h-4 mr-2" />
          View Calendar
        </Button>
      </div>

      {/* Booking Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-yellow-600" />
              Pending Requests
            </CardTitle>
            <CardDescription>
              New booking requests awaiting your response
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="text-2xl font-bold text-yellow-600">3</div>
            <p className="text-sm text-gray-500 mt-1">Require action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Confirmed Bookings
            </CardTitle>
            <CardDescription>
              Active and upcoming confirmed rentals
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="text-2xl font-bold text-green-600">8</div>
            <p className="text-sm text-gray-500 mt-1">Active rentals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Messages
            </CardTitle>
            <CardDescription>
              Communication with renters
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <p className="text-sm text-gray-500 mt-1">Unread messages</p>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Management</CardTitle>
          <CardDescription>
            Full booking workflow and communication tools
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
          <p className="text-gray-500 mb-4">
            Complete booking management system is under development.
          </p>
          <p className="text-sm text-gray-400">
            This will include request handling, messaging, and calendar integration.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
