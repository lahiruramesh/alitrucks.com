import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import BuyerRegistrationForm from '@/components/buyer/BuyerRegistrationForm'

export const metadata: Metadata = {
  title: 'Buyer Registration - Ali Trucks',
  description: 'Register as a buyer to rent eco-friendly trucks',
}

export default async function BuyerRegisterPage() {
  const supabase = await createClient()
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  // Check if buyer profile already exists
  const { data: existingProfile } = await supabase
    .from('buyer_profiles')
    .select('id')
    .eq('user_id', session.user.id)
    .single()

  if (existingProfile) {
    redirect('/buyer/dashboard')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Complete Your Buyer Profile</h1>
          <p className="text-muted-foreground mt-2">
            Register as a buyer to start renting eco-friendly trucks and track your environmental impact.
          </p>
        </div>
        <BuyerRegistrationForm />
      </div>
    </div>
  )
}
