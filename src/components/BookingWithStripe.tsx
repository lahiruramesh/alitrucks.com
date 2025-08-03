'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { CreditCard, Shield, CalendarIcon } from 'lucide-react'
import { differenceInDays } from 'date-fns'
import { StripePaymentForm } from '@/components/StripePaymentForm'

interface BookingWithStripeProps {
  vehicle: {
    id: number
    name: string
    price: number
    location: string
    seller_id: string
  }
}

interface BookingFormData {
  startDate: string
  endDate: string
  pickupTime: string
  returnTime: string
  pickupLocation: string
  returnLocation: string
  renterEmail: string
  renterPhone: string
  renterNotes: string
  specialRequests: string
}

export default function BookingWithStripe({ vehicle }: BookingWithStripeProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [paymentStep, setPaymentStep] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
  const [formData, setFormData] = useState<BookingFormData>({
    startDate: '',
    endDate: '',
    pickupTime: '',
    returnTime: '',
    pickupLocation: vehicle.location,
    returnLocation: vehicle.location,
    renterEmail: user?.email || '',
    renterPhone: '',
    renterNotes: '',
    specialRequests: ''
  })

  const supabase = createClient()

  // Calculate booking details
  const calculateTotalDays = () => {
    if (!formData.startDate || !formData.endDate) return 1
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    return Math.max(1, differenceInDays(end, start))
  }

  const totalDays = calculateTotalDays()
  const subtotal = totalDays * vehicle.price
  const serviceFee = Math.round(subtotal * 0.05) // 5% service fee
  const taxes = Math.round(subtotal * 0.08) // 8% tax
  const totalAmount = subtotal + serviceFee + taxes

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const createStripePaymentIntent = async () => {
    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          startDate: formData.startDate,
          endDate: formData.endDate,
          totalAmount: totalAmount,
          customerEmail: user?.email,
          customerName: user?.user_metadata?.full_name || user?.email,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create payment intent')
      }

      const { clientSecret, paymentIntentId } = await response.json()
      return { clientSecret, paymentIntentId }

    } catch (error) {
      console.error('Error creating payment intent:', error)
      throw error
    }
  }

  const handleBooking = async () => {
    if (!user) {
      alert('Please log in to make a booking')
      return
    }

    if (!formData.startDate || !formData.endDate) {
      alert('Please select booking dates')
      return
    }

    if (!formData.renterEmail || !formData.renterPhone) {
      alert('Please fill in contact information')
      return
    }

    setLoading(true)

    try {
      // Create Stripe payment intent first
      const paymentIntent = await createStripePaymentIntent()
      
      if (paymentIntent?.clientSecret) {
        // Store payment intent in state to proceed to payment
        setPaymentStep(true)
        setClientSecret(paymentIntent.clientSecret)
        setPaymentIntentId(paymentIntent.paymentIntentId)
      }

    } catch (error) {
      console.error('Booking error:', error)
      alert('Failed to initiate payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = async () => {
    if (!paymentIntentId) return

    setLoading(true)
    try {
      // Create booking record after successful payment
      const bookingData = {
        buyer_id: user!.id,
        seller_id: vehicle.seller_id,
        vehicle_id: vehicle.id,
        start_date: formData.startDate,
        end_date: formData.endDate,
        pickup_location: formData.pickupLocation,
        pickup_time: formData.pickupTime || null,
        return_location: formData.returnLocation || null,
        return_time: formData.returnTime || null,
        renter_email: formData.renterEmail,
        renter_phone: formData.renterPhone,
        renter_notes: formData.renterNotes || null,
        special_requests: formData.specialRequests || null,
        price_per_day: vehicle.price,
        total_days: totalDays,
        subtotal: subtotal,
        service_fee: serviceFee,
        taxes: taxes,
        total_amount: totalAmount,
        status: 'confirmed' as const,
        payment_status: 'paid' as const,
        stripe_payment_intent_id: paymentIntentId,
        confirmed_at: new Date().toISOString()
      }

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single()

      if (bookingError) throw bookingError

      alert('Booking confirmed! Payment processed successfully.')
      
      // Redirect to booking confirmation page
      window.location.href = `/buyer/bookings?booking=${booking.id}`

    } catch (error) {
      console.error('Booking creation error:', error)
      alert('Payment succeeded but failed to create booking record. Please contact support.')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error)
    alert(`Payment failed: ${error}`)
    // Reset to booking form
    setPaymentStep(false)
    setClientSecret(null)
    setPaymentIntentId(null)
  }

  const isFormValid = formData.startDate && 
                     formData.endDate && 
                     formData.renterEmail && 
                     formData.renterPhone

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  // If we're in payment step, show payment form
  if (paymentStep && clientSecret) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Complete Your Payment</h3>
          <p className="text-gray-600">
            Booking {vehicle.name} for {totalDays} day{totalDays > 1 ? 's' : ''}
          </p>
        </div>
        
        <StripePaymentForm
          clientSecret={clientSecret}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          amount={totalAmount}
          loading={loading}
        />
        
        <Button 
          variant="outline" 
          onClick={() => {
            setPaymentStep(false)
            setClientSecret(null)
            setPaymentIntentId(null)
          }}
          className="w-full"
        >
          Back to Booking Form
        </Button>
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Book this Vehicle
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dates */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <div className="relative">
              <Input
                id="startDate"
                type="date"
                min={today}
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="pl-10"
              />
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
          </div>
          
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <div className="relative">
              <Input
                id="endDate"
                type="date"
                min={formData.startDate || today}
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="pl-10"
              />
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Times */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="pickupTime">Pickup Time</Label>
            <Input
              id="pickupTime"
              type="time"
              value={formData.pickupTime}
              onChange={(e) => handleInputChange('pickupTime', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="returnTime">Return Time</Label>
            <Input
              id="returnTime"
              type="time"
              value={formData.returnTime}
              onChange={(e) => handleInputChange('returnTime', e.target.value)}
            />
          </div>
        </div>

        {/* Locations */}
        <div>
          <Label htmlFor="pickupLocation">Pickup Location</Label>
          <Input
            id="pickupLocation"
            value={formData.pickupLocation}
            onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
            placeholder="Enter pickup address"
          />
        </div>

        <div>
          <Label htmlFor="returnLocation">Return Location</Label>
          <Input
            id="returnLocation"
            value={formData.returnLocation}
            onChange={(e) => handleInputChange('returnLocation', e.target.value)}
            placeholder="Enter return address"
          />
        </div>

        {/* Contact Info */}
        <div>
          <Label htmlFor="renterEmail">Email</Label>
          <Input
            id="renterEmail"
            type="email"
            value={formData.renterEmail}
            onChange={(e) => handleInputChange('renterEmail', e.target.value)}
            placeholder="your@email.com"
          />
        </div>

        <div>
          <Label htmlFor="renterPhone">Phone</Label>
          <Input
            id="renterPhone"
            type="tel"
            value={formData.renterPhone}
            onChange={(e) => handleInputChange('renterPhone', e.target.value)}
            placeholder="(555) 123-4567"
          />
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="renterNotes">Notes</Label>
          <Textarea
            id="renterNotes"
            value={formData.renterNotes}
            onChange={(e) => handleInputChange('renterNotes', e.target.value)}
            placeholder="Any additional notes or requirements"
            rows={3}
          />
        </div>

        {/* Pricing Summary */}
        <div className="border-t pt-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>${vehicle.price}/day × {totalDays} days</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Service fee</span>
              <span>${serviceFee}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span>
              <span>${taxes}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total</span>
              <span>${totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded">
          <Shield className="w-4 h-4" />
          <span>Secure payment processing via Stripe. Your payment information is encrypted and protected.</span>
        </div>

        {/* Book Button */}
        <Button 
          onClick={handleBooking}
          disabled={!isFormValid || loading}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {loading ? 'Processing...' : `Book Now - $${totalAmount}`}
        </Button>

        {!user && (
          <p className="text-sm text-gray-600 text-center">
            Please <a href="/auth/login" className="text-blue-600 hover:underline">log in</a> to make a booking
          </p>
        )}
      </CardContent>
    </Card>
  )
}
