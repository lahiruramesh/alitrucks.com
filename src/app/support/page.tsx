import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  HelpCircle,
  FileText,
  Shield
} from 'lucide-react'

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            We&apos;re Here to Help
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get support when you need it. Our dedicated team is available 24/7 
            to assist with any questions or issues you may have.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Get in Touch</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Phone Support */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-lg">Phone Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Speak directly with our support team
                </p>
                <p className="font-semibold text-green-600 mb-2">1-800-TRUCKS-1</p>
                <p className="text-sm text-gray-500">Available 24/7</p>
              </CardContent>
            </Card>

            {/* Email Support */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Email Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Send us a detailed message
                </p>
                <p className="font-semibold text-blue-600 mb-2">support@alitrucks.com</p>
                <p className="text-sm text-gray-500">Response within 2 hours</p>
              </CardContent>
            </Card>

            {/* Live Chat */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Live Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Instant help through chat
                </p>
                <Button className="w-full">Start Chat</Button>
                <p className="text-sm text-gray-500 mt-2">Usually responds instantly</p>
              </CardContent>
            </Card>

            {/* Help Center */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Help Center</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Browse our knowledge base
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/faq">Browse Articles</Link>
                </Button>
                <p className="text-sm text-gray-500 mt-2">Self-service support</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Send us a Message</h2>
            
            <Card>
              <CardContent className="p-6">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name</label>
                      <Input placeholder="Your first name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name</label>
                      <Input placeholder="Your last name" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input type="email" placeholder="your.email@example.com" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option>Select a topic</option>
                      <option>Booking Issues</option>
                      <option>Payment Problems</option>
                      <option>Vehicle Concerns</option>
                      <option>Account Help</option>
                      <option>Technical Support</option>
                      <option>Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <Textarea 
                      placeholder="Please describe your issue or question in detail..."
                      rows={6}
                    />
                  </div>
                  
                  <Button className="w-full" size="lg">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I book a truck?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Simply search for trucks in your area, select your dates, 
                  and complete the booking with secure payment. You&apos;ll receive 
                  instant confirmation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We accept all major credit cards, debit cards, and digital payment 
                  methods through our secure payment processor.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is insurance included?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes, all rentals include comprehensive insurance coverage. 
                  Additional coverage options are available during booking.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel my booking?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes, you can cancel your booking according to our cancellation 
                  policy. Free cancellation is available up to 24 hours before pickup.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What if I have issues during rental?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our 24/7 support team is available to help with any issues. 
                  Contact us immediately if you experience any problems.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I become a vehicle owner?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Register as a vehicle owner, complete verification, and list your 
                  trucks. Our team will review and approve your listings.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Additional Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle>User Guides</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Step-by-step guides for renters and vehicle owners
                </p>
                <Button variant="outline" asChild>
                  <Link href="/guides">View Guides</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle>Safety Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Important safety information and best practices
                </p>
                <Button variant="outline" asChild>
                  <Link href="/safety">Learn More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle>Status Page</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Check system status and service updates
                </p>
                <Button variant="outline" asChild>
                  <Link href="/status">Check Status</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Office Info */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6">Visit Our Office</h2>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <MapPin className="w-5 h-5 text-green-600" />
              <span>123 Business Ave, Suite 100, San Francisco, CA 94105</span>
            </div>
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Monday - Friday: 9:00 AM - 6:00 PM PST</span>
            </div>
            <p className="text-gray-600">
              Our headquarters are located in the heart of San Francisco. 
              While we operate digitally, you&apos;re welcome to visit us during business hours.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
