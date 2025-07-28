'use client'

import { useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Truck } from 'lucide-react'
import { useBookings } from '@/hooks/useBookings'
import { useAuth } from '@/hooks/useAuth'
import { BookingManagementCard } from './BookingManagementCard'

interface BookingListProps {
  role?: 'buyer' | 'seller'
  vehicleId?: number
}

export function BookingList({ role, vehicleId }: BookingListProps) {
  const { user } = useAuth()
  const { bookings, loading, updateBooking, refreshBookings } = useBookings()

  useEffect(() => {
    if (user) {
      refreshBookings()
    }
  }, [user, refreshBookings])

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    await updateBooking(bookingId, { status })
  }

  const handleMessage = (bookingId: string) => {
    console.log('Open message dialog for booking:', bookingId)
  }

  const handleReview = (bookingId: string) => {
    console.log('Open review dialog for booking:', bookingId)
  }

  const filteredBookings = vehicleId 
    ? bookings.filter(booking => booking.vehicle_id === vehicleId)
    : bookings

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (filteredBookings.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Truck className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">
            {role === 'seller' 
              ? "You haven't received any booking requests yet." 
              : "You haven't made any bookings yet."}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {filteredBookings.map((booking) => (
        <BookingManagementCard
          key={booking.id}
          booking={booking}
          role={role || 'buyer'}
          onStatusUpdate={handleStatusUpdate}
          onMessage={handleMessage}
          onReview={handleReview}
        />
      ))}
    </div>
  )
}
