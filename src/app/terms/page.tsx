import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center">Terms of Service</CardTitle>
            <p className="text-center text-gray-600">Last updated: August 3, 2025</p>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using AliTrucks, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to these terms, you should 
                not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
              <p className="mb-4">
                Permission is granted to temporarily use AliTrucks for personal, commercial, 
                or non-commercial transactional use only. This is the grant of a license, not a 
                transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
              <p className="mb-4">
                When you create an account with us, you must provide information that is accurate, 
                complete, and current at all times. You are responsible for safeguarding the password 
                and for all activities that occur under your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">4. Vehicle Listings</h2>
              <p className="mb-4">Vehicle owners who list vehicles on our platform agree to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Provide accurate and truthful information about their vehicles</li>
                <li>Maintain vehicles in safe, working condition</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Honor confirmed bookings</li>
                <li>Maintain appropriate insurance coverage</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">5. Bookings and Payments</h2>
              <p className="mb-4">
                All bookings are subject to availability and confirmation. Payment processing is 
                handled by third-party payment processors. We are not responsible for any issues 
                arising from payment processing.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Cancellation Policy</h2>
              <p className="mb-4">
                Cancellation policies vary by listing and are set by individual vehicle owners. 
                Please review the specific cancellation policy before booking.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">7. Prohibited Uses</h2>
              <p className="mb-4">You may not use our service:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">8. Disclaimer</h2>
              <p className="mb-4">
                The materials on AliTrucks are provided on an &apos;as is&apos; basis. AliTrucks makes no 
                warranties, expressed or implied, and hereby disclaims and negates all other warranties 
                including without limitation, implied warranties or conditions of merchantability, 
                fitness for a particular purpose, or non-infringement of intellectual property or 
                other violation of rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">9. Limitations</h2>
              <p className="mb-4">
                In no event shall AliTrucks or its suppliers be liable for any damages (including, 
                without limitation, damages for loss of data or profit, or due to business interruption) 
                arising out of the use or inability to use the materials on AliTrucks, even if AliTrucks 
                or a AliTrucks authorized representative has been notified orally or in writing of the 
                possibility of such damage.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">10. Accuracy of Materials</h2>
              <p className="mb-4">
                The materials appearing on AliTrucks could include technical, typographical, or 
                photographic errors. AliTrucks does not warrant that any of the materials on its 
                website are accurate, complete, or current.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">11. Links</h2>
              <p className="mb-4">
                AliTrucks has not reviewed all of the sites linked to our platform and is not 
                responsible for the contents of any such linked site. The inclusion of any link 
                does not imply endorsement by AliTrucks of the site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">12. Modifications</h2>
              <p className="mb-4">
                AliTrucks may revise these terms of service for its website at any time without notice. 
                By using this website, you are agreeing to be bound by the then current version of 
                these terms of service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">13. Governing Law</h2>
              <p className="mb-4">
                These terms and conditions are governed by and construed in accordance with the laws 
                of California and you irrevocably submit to the exclusive jurisdiction of the courts 
                in that State or location.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">14. Contact Information</h2>
              <p className="mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <ul className="list-none mb-4">
                <li>Email: legal@alitrucks.com</li>
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
