'use client'

import { useState } from 'react'
import { Database } from '@/types/database'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type Booking = Database['public']['Tables']['bookings']['Row']
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, Clock, MapPin, CreditCard } from 'lucide-react'
import { useBookings } from '@/hooks/useBookings'
interface VehicleWithDetails {
  id: number
  seller_id: string
  brand_id: number
  model_id: number
  year: number
  color: string
  vin: string | null
  price_per_day: number
  location: string
  availability_start_date: string
  availability_end_date: string
  description: string | null
  key_features: string[] | null
  created_at: string
  updated_at: string
  status: "pending" | "approved" | "rejected"
  vehicle_registration_number: string
  rejection_reason: string | null
  brand?: { name: string }
  model?: { name: string }
}

interface BookingFormProps {
  vehicle: VehicleWithDetails
  onBookingCreated?: (booking: Booking) => void
  onCancel?: () => void
}

export function BookingForm({ vehicle, onBookingCreated, onCancel }: BookingFormProps) {
  const { createBooking, loading } = useBookings()
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    pickup_time: '09:00',
    return_time: '18:00',
    pickup_location: vehicle.location,
    return_location: '',
    special_requests: '',
    renter_notes: '',
    renter_phone: '',
    renter_email: '',
  })

  const calculatePricing = () => {
    if (!formData.start_date || !formData.end_date) {
      return { totalDays: 0, subtotal: 0, serviceFee: 0, taxes: 0, total: 0 }
    }

    const startDate = new Date(formData.start_date)
    const endDate = new Date(formData.end_date)
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (totalDays <= 0) {
      return { totalDays: 0, subtotal: 0, serviceFee: 0, taxes: 0, total: 0 }
    }

    const subtotal = vehicle.price_per_day * totalDays
    const serviceFee = subtotal * 0.1
    const taxes = subtotal * 0.08
    const total = subtotal + serviceFee + taxes

    return { totalDays, subtotal, serviceFee, taxes, total }
  }

  const pricing = calculatePricing()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (pricing.totalDays <= 0) {
      alert('Please select valid dates')
      return
    }

    const bookingData = {
      vehicle_id: vehicle.id,
      ...formData,
    }

    const booking = await createBooking(bookingData)
    if (booking) {
      onBookingCreated?.(booking)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Book {vehicle.brand?.name} {vehicle.model?.name} ({vehicle.year})
          </CardTitle>
          <CardDescription>
            Complete the form below to request this vehicle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                  min={formData.start_date || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pickup_time" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Pickup Time
                </Label>
                <Input
                  id="pickup_time"
                  type="time"
                  value={formData.pickup_time}
                  onChange={(e) => handleInputChange('pickup_time', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="return_time" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Return Time
                </Label>
                <Input
                  id="return_time"
                  type="time"
                  value={formData.return_time}
                  onChange={(e) => handleInputChange('return_time', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="pickup_location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Pickup Location
              </Label>
              <Input
                id="pickup_location"
                value={formData.pickup_location}
                onChange={(e) => handleInputChange('pickup_location', e.target.value)}
                placeholder="Where would you like to pick up the vehicle?"
                required
              />
            </div>

            <div>
              <Label htmlFor="return_location">Return Location (optional)</Label>
              <Input
                id="return_location"
                value={formData.return_location}
                onChange={(e) => handleInputChange('return_location', e.target.value)}
                placeholder="Different return location (leave blank for same as pickup)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="renter_phone">Phone Number</Label>
                <Input
                  id="renter_phone"
                  type="tel"
                  value={formData.renter_phone}
                  onChange={(e) => handleInputChange('renter_phone', e.target.value)}
                  placeholder="Your contact number"
                />
              </div>
              <div>
                <Label htmlFor="renter_email">Email Address</Label>
                <Input
                  id="renter_email"
                  type="email"
                  value={formData.renter_email}
                  onChange={(e) => handleInputChange('renter_email', e.target.value)}
                  placeholder="Your email address"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="special_requests">Special Requests</Label>
              <Textarea
                id="special_requests"
                value={formData.special_requests}
                onChange={(e) => handleInputChange('special_requests', e.target.value)}
                placeholder="Any special requirements or requests?"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="renter_notes">Additional Notes</Label>
              <Textarea
                id="renter_notes"
                value={formData.renter_notes}
                onChange={(e) => handleInputChange('renter_notes', e.target.value)}
                placeholder="Tell the owner about your rental needs"
                rows={3}
              />
            </div>

            {pricing.totalDays > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Pricing Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>${vehicle.price_per_day}/day × {pricing.totalDays} days</span>
                    <span>${pricing.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Service fee (10%)</span>
                    <span>${pricing.serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Taxes (8%)</span>
                    <span>${pricing.taxes.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${pricing.total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={loading || pricing.totalDays <= 0} className="flex-1">
                {loading ? 'Creating Booking...' : 'Request Booking'}
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
