'use client'

import { Elements } from '@stripe/react-stripe-js'
import getStripe from '@/lib/stripe'
import BookingWithStripe from '@/components/BookingWithStripe'

interface BookingWithStripeWrapperProps {
  vehicle: {
    id: number
    name: string
    price: number
    location: string
    seller_id: string
  }
}

export default function BookingWithStripeWrapper({ vehicle }: BookingWithStripeWrapperProps) {
  return (
    <Elements stripe={getStripe()}>
      <BookingWithStripe vehicle={vehicle} />
    </Elements>
  )
}
