'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useBookings } from '@/hooks/useBookings'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Calendar, MapPin, Search, Filter } from 'lucide-react'

export default function BuyerBookingsList() {
  const { bookings, loading, error } = useBookings({ role: 'buyer' })
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const filteredBookings = bookings
    .filter(booking => {
      const matchesSearch = booking.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
      } else if (sortBy === 'oldest') {
        return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()
      } else if (sortBy === 'amount-high') {
        return (Number(b.total_amount) || 0) - (Number(a.total_amount) || 0)
      } else if (sortBy === 'amount-low') {
        return (Number(a.total_amount) || 0) - (Number(b.total_amount) || 0)
      }
      return 0
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default'
      case 'active': return 'default'
      case 'completed': return 'secondary'
      case 'cancelled': return 'destructive'
      case 'rejected': return 'destructive'
      case 'pending': return 'outline'
      default: return 'outline'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading bookings...</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">Error: {error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="amount-high">Amount High to Low</SelectItem>
                <SelectItem value="amount-low">Amount Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No bookings match your filters' 
                  : 'No bookings yet'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button className="mt-4">Browse Trucks</Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">Booking #{booking.id.slice(0, 8)}</h3>
                      <Badge variant={getStatusColor(booking.status || 'pending')}>
                        {booking.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          {booking.start_date && formatDate(booking.start_date)} - 
                          {booking.end_date && formatDate(booking.end_date)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{booking.pickup_location || 'Location TBD'}</span>
                      </div>
                    </div>

                    {booking.special_requests && (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">
                          <strong>Requirements:</strong> {booking.special_requests}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="text-right lg:w-32">
                    <p className="text-2xl font-bold">{formatCurrency(Number(booking.total_amount) || 0)}</p>
                    <p className="text-sm text-muted-foreground">
                      Created {booking.created_at ? formatDate(booking.created_at) : 'Unknown'}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => {
                        // Navigate to booking details
                        window.location.href = `/buyer/bookings/${booking.id}`
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
