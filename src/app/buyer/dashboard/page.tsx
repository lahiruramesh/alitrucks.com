import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import BuyerDashboard from '@/components/buyer/BuyerDashboard'

export const metadata: Metadata = {
  title: 'Buyer Dashboard - Ali Trucks',
  description: 'Manage your truck rentals and bookings',
}

export default async function BuyerDashboardPage() {
  const supabase = await createClient()
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return <BuyerDashboard />
}
