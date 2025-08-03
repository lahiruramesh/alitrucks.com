import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe-server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('No Stripe signature found')
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('STRIPE_WEBHOOK_SECRET not configured')
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
    }

    // Verify webhook signature
    let event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object
        const metadata = paymentIntent.metadata

        // Create booking record
        const { error: bookingError } = await supabaseAdmin
          .from('bookings')
          .insert({
            user_id: metadata.userId,
            vehicle_id: parseInt(metadata.vehicleId),
            seller_id: metadata.sellerId,
            start_date: metadata.startDate,
            end_date: metadata.endDate,
            total_amount: paymentIntent.amount_received / 100, // Convert from cents
            payment_status: 'completed',
            booking_status: 'confirmed',
            stripe_payment_intent_id: paymentIntent.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

        if (bookingError) {
          console.error('Failed to create booking:', bookingError)
          return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
        }

        console.log('Booking created successfully for payment intent:', paymentIntent.id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object
        console.log('Payment failed for intent:', paymentIntent.id)
        
        // Optionally, you can create a failed booking record or send notifications
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' }, 
      { status: 500 }
    )
  }
}
