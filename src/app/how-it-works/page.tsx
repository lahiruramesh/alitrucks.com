import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search, 
  Calendar, 
  CreditCard, 
  Truck, 
  Shield, 
  Users, 
  Clock, 
  MapPin,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            How AliTrucks Works
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Rent commercial vehicles in just a few simple steps. 
            Fast, secure, and reliable truck rentals for your business needs.
          </p>
        </div>
      </section>

      {/* For Renters Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">For Renters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* Step 1 */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-lg">1. Search & Filter</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Find the perfect truck for your needs using our advanced search filters. 
                  Filter by location, size, fuel type, and more.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">2. Select Dates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Choose your rental dates and see real-time availability. 
                  Our calendar system ensures accurate booking information.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-lg">3. Book & Pay</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Secure booking with instant confirmation. 
                  Multiple payment options and transparent pricing with no hidden fees.
                </p>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle className="text-lg">4. Pick Up & Go</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Meet the owner at the pickup location, complete a quick inspection, 
                  and you&apos;re ready to go with your rental truck.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Features for Renters */}
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h3 className="text-2xl font-bold mb-6 text-center">Why Choose AliTrucks?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Verified Vehicles</h4>
                  <p className="text-gray-600 text-sm">All trucks are inspected and verified for safety and reliability.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">24/7 Support</h4>
                  <p className="text-gray-600 text-sm">Round-the-clock customer support for any questions or issues.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-purple-600 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Instant Booking</h4>
                  <p className="text-gray-600 text-sm">Book instantly with real-time availability and immediate confirmation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Owners Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">For Vehicle Owners</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Step 1 */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-lg">1. Create Account</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Sign up as a vehicle owner and complete your profile verification. 
                  Quick and easy registration process.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">2. List Your Vehicle</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Add your truck details, photos, and set your pricing. 
                  Our team will verify your listing for quality and safety.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-lg">3. Start Earning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Receive booking requests, manage your calendar, 
                  and start earning money from your idle vehicles.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Benefits for Owners */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Benefits for Vehicle Owners</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <CreditCard className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Guaranteed Payments</h4>
                  <p className="text-gray-600 text-sm">Secure payment processing with guaranteed payouts for completed rentals.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Insurance Coverage</h4>
                  <p className="text-gray-600 text-sm">Comprehensive insurance coverage for all rentals through our platform.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="w-6 h-6 text-purple-600 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Verified Renters</h4>
                  <p className="text-gray-600 text-sm">All renters go through verification process for your peace of mind.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-6 h-6 text-orange-600 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Flexible Schedule</h4>
                  <p className="text-gray-600 text-sm">Set your own availability and pricing. You&apos;re in complete control.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust AliTrucks for their commercial vehicle needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              <Link href="/search">
                Find a Truck
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
              <Link href="/auth/register">
                List Your Vehicle
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
