'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Clock, DollarSign, MessageSquare, Star } from 'lucide-react'
import { Database } from '@/types/database'

type Booking = Database['public']['Tables']['bookings']['Row']

interface BookingManagementCardProps {
  booking: Booking
  role: 'buyer' | 'seller'
  onStatusUpdate?: (bookingId: string, status: string) => void
  onMessage?: (bookingId: string) => void
  onReview?: (bookingId: string) => void
}

export function BookingManagementCard({ 
  booking, 
  role, 
  onStatusUpdate, 
  onMessage, 
  onReview 
}: BookingManagementCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'paid': return 'bg-green-100 text-green-800 border-green-200'
      case 'refunded': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'partial_refund': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'failed': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01 ${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const canCancelBooking = () => {
    const now = new Date()
    const startDate = new Date(booking.start_date)
    const hoursUntilStart = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    
    return booking.status === 'confirmed' && hoursUntilStart > 24
  }

  const canLeaveReview = () => {
    return booking.status === 'completed'
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Booking #{booking.id.slice(-8)}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4" />
              {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className={getStatusColor(booking.status)}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
            <Badge className={getPaymentStatusColor(booking.payment_status)}>
              {booking.payment_status.replace('_', ' ').charAt(0).toUpperCase() + booking.payment_status.replace('_', ' ').slice(1)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Pickup</p>
              <p className="text-sm text-gray-600">{booking.pickup_time ? formatTime(booking.pickup_time) : 'TBD'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Return</p>
              <p className="text-sm text-gray-600">{booking.return_time ? formatTime(booking.return_time) : 'TBD'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Location</p>
              <p className="text-sm text-gray-600 truncate" title={booking.pickup_location}>
                {booking.pickup_location}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Total</p>
              <p className="text-sm font-semibold text-green-600">
                ${booking.total_amount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium">Duration:</span>
            <span className="ml-1">{booking.total_days} {booking.total_days === 1 ? 'day' : 'days'}</span>
          </div>
          <div>
            <span className="font-medium">Rate:</span>
            <span className="ml-1">${booking.price_per_day}/day</span>
          </div>
          {booking.return_location && booking.return_location !== booking.pickup_location && (
            <div>
              <span className="font-medium">Return:</span>
              <span className="ml-1 truncate" title={booking.return_location}>
                {booking.return_location}
              </span>
            </div>
          )}
        </div>

        {booking.renter_notes && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium mb-1">Renter Notes:</p>
            <p className="text-sm text-gray-700">{booking.renter_notes}</p>
          </div>
        )}

        {booking.special_requests && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium mb-1">Special Requests:</p>
            <p className="text-sm text-blue-700">{booking.special_requests}</p>
          </div>
        )}

        {booking.seller_notes && (
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm font-medium mb-1">Seller Notes:</p>
            <p className="text-sm text-green-700">{booking.seller_notes}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          {role === 'seller' && booking.status === 'pending' && (
            <>
              <Button 
                size="sm" 
                onClick={() => onStatusUpdate?.(booking.id, 'confirmed')}
                className="bg-green-600 hover:bg-green-700"
              >
                Accept
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onStatusUpdate?.(booking.id, 'rejected')}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Decline
              </Button>
            </>
          )}

          {booking.status === 'confirmed' && (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onMessage?.(booking.id)}
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                Message
              </Button>
              
              {canCancelBooking() && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onStatusUpdate?.(booking.id, 'cancelled')}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  Cancel
                </Button>
              )}
            </>
          )}

          {booking.status === 'active' && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onMessage?.(booking.id)}
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              Contact {role === 'seller' ? 'Renter' : 'Owner'}
            </Button>
          )}

          {canLeaveReview() && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onReview?.(booking.id)}
            >
              <Star className="w-4 h-4 mr-1" />
              Leave Review
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
