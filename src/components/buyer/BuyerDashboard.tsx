'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useBookings } from '@/hooks/useBookings'
import { useAuth } from '@/hooks/useAuth'
import { formatCurrency } from '@/lib/utils'
import { Calendar, MapPin, Truck, CreditCard, Leaf, TrendingUp } from 'lucide-react'
import BuyerBookingsList from './BuyerBookingsList'
import BuyerProfile from './BuyerProfile'
import BuyerCarbonSavings from './BuyerCarbonSavings'

export default function BuyerDashboard() {
  const { user } = useAuth()
  const { bookings, loading } = useBookings({ role: 'buyer' })
  const [activeTab, setActiveTab] = useState('overview')

  // Calculate dashboard stats
  const totalBookings = bookings.length
  const activeBookings = bookings.filter(b => ['confirmed', 'active'].includes(b.status || '')).length
  const completedBookings = bookings.filter(b => b.status === 'completed').length
  const totalSpent = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0)

  // Calculate carbon savings (mock calculation for now)
  const totalCarbonSaved = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => {
      // Estimate 2.5 kg CO2 saved per day for electric trucks
      const days = b.end_date && b.start_date 
        ? Math.ceil((new Date(b.end_date).getTime() - new Date(b.start_date).getTime()) / (1000 * 60 * 60 * 24))
        : 1
      return sum + (days * 2.5)
    }, 0)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.email?.split('@')[0] || 'Buyer'}</h1>
          <p className="text-muted-foreground">Manage your truck rentals and track your environmental impact</p>
        </div>
        <Button>
          <Truck className="w-4 h-4 mr-2" />
          Browse Trucks
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              {activeBookings} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Trips</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedBookings}</div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
            <p className="text-xs text-muted-foreground">
              Across all bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Saved</CardTitle>
            <Leaf className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalCarbonSaved.toFixed(1)} kg</div>
            <p className="text-xs text-muted-foreground">
              CO₂ emissions avoided
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="carbon">Carbon Impact</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Truck className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No bookings yet</p>
                    <Button className="mt-4">Browse Trucks</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">Booking #{booking.id.slice(0, 8)}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.start_date && new Date(booking.start_date).toLocaleDateString()} - 
                            {booking.end_date && new Date(booking.end_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            booking.status === 'confirmed' ? 'default' :
                            booking.status === 'completed' ? 'secondary' :
                            booking.status === 'active' ? 'default' : 'outline'
                          }>
                            {booking.status}
                          </Badge>
                          <p className="text-sm font-medium mt-1">
                            {formatCurrency(Number(booking.total_amount) || 0)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Environmental Impact Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="w-5 h-5 mr-2 text-green-600" />
                  Environmental Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total CO₂ Saved</span>
                    <span className="font-bold text-green-600">{totalCarbonSaved.toFixed(1)} kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Electric Trips</span>
                    <span className="font-bold">{completedBookings}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Eco Score</span>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      <span className="font-bold text-green-600">Excellent</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full">
                      View Detailed Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookings">
          <BuyerBookingsList />
        </TabsContent>

        <TabsContent value="carbon">
          <BuyerCarbonSavings />
        </TabsContent>

        <TabsContent value="profile">
          <BuyerProfile />
        </TabsContent>
      </Tabs>
    </div>
  )
}
