import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center">Privacy Policy</CardTitle>
            <p className="text-center text-gray-600">Last updated: August 3, 2025</p>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                list a vehicle, make a booking, or contact us for support.
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Personal information (name, email, phone number, address)</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Vehicle information (for listings)</li>
                <li>Usage data and preferences</li>
                <li>Communications with our support team</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices, updates, and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Prevent fraud and enhance security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
              <p className="mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                except as described in this policy:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>With service providers who assist in our operations</li>
                <li>To comply with legal requirements</li>
                <li>To protect our rights and prevent fraud</li>
                <li>With your consent</li>
                <li>In connection with a business transfer</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
              <p className="mb-4">
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Access and receive a copy of your personal data</li>
                <li>Rectify inaccurate personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Cookies and Tracking</h2>
              <p className="mb-4">
                We use cookies and similar tracking technologies to enhance your experience, 
                analyze usage, and deliver personalized content.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">7. Children&apos;s Privacy</h2>
              <p className="mb-4">
                Our service is not intended for children under 18 years of age. We do not knowingly 
                collect personal information from children under 18.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">8. Changes to This Policy</h2>
              <p className="mb-4">
                We may update this privacy policy from time to time. We will notify you of any 
                changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this privacy policy, please contact us at:
              </p>
              <ul className="list-none mb-4">
                <li>Email: privacy@alitrucks.com</li>
                <li>Phone: 1-800-TRUCKS-1</li>
                <li>Address: 123 Business Ave, Suite 100, San Francisco, CA 94105</li>
              </ul>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
