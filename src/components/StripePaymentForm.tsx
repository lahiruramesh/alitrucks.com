'use client'

import { useState } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface StripePaymentFormProps {
  clientSecret: string
  onSuccess: () => void
  onError: (error: string) => void
  amount: number
  loading: boolean
}

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
  },
}

export function StripePaymentForm({ 
  clientSecret, 
  onSuccess, 
  onError, 
  amount, 
  loading 
}: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setPaymentLoading(true)
    setPaymentError(null)

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setPaymentError('Card element not found')
      setPaymentLoading(false)
      return
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      })

      if (error) {
        setPaymentError(error.message || 'Payment failed')
        onError(error.message || 'Payment failed')
      } else if (paymentIntent?.status === 'succeeded') {
        onSuccess()
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setPaymentError(errorMessage)
      onError(errorMessage)
    } finally {
      setPaymentLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Card Information
              </label>
              <div className="p-3 border rounded-md">
                <CardElement options={cardElementOptions} />
              </div>
            </div>

            {paymentError && (
              <Alert variant="destructive">
                <AlertDescription>{paymentError}</AlertDescription>
              </Alert>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount:</span>
                <span className="text-lg font-bold">${amount.toFixed(2)}</span>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={!stripe || paymentLoading || loading}
            >
              {paymentLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                `Pay $${amount.toFixed(2)}`
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
