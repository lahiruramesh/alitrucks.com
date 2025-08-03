// Edge Function for creating Stripe payment intents
// This function handles Stripe payment intent creation for vehicle bookings

export default async function handler(req: Request) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    })
  }

  try {
    const { amount, currency = 'usd', customer_email, metadata } = await req.json()

    // Validate required fields
    if (!amount || amount < 50) {
      throw new Error('Amount must be at least $0.50')
    }

    if (!customer_email) {
      throw new Error('Customer email is required')
    }

    // For demo purposes, return a mock payment intent
    // In production, this would create a real Stripe payment intent
    const mockPaymentIntent = {
      client_secret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      payment_intent_id: `pi_mock_${Date.now()}`,
      amount: amount,
      currency: currency,
      status: 'requires_payment_method'
    }

    return new Response(
      JSON.stringify(mockPaymentIntent),
      {
        headers: { 
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json' 
        },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Payment intent creation error:', error)
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to create payment intent',
      }),
      {
        headers: { 
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json' 
        },
        status: 400,
      }
    )
  }
}
