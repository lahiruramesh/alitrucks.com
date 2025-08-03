import Link from 'next/link'
import { Truck, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Truck className="w-8 h-8 text-green-400" />
              <span className="text-xl font-bold">AliTrucks</span>
            </div>
            <p className="text-gray-300 text-sm">
              Your trusted platform for commercial vehicle rentals. 
              Connecting businesses with reliable trucks for all transportation needs.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/search" className="text-gray-300 hover:text-white transition-colors">Search Trucks</Link></li>
              <li><Link href="/how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/become-seller" className="text-gray-300 hover:text-white transition-colors">List Your Truck</Link></li>
              <li><Link href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/support" className="text-gray-300 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/safety" className="text-gray-300 hover:text-white transition-colors">Safety</Link></li>
              <li><Link href="/insurance" className="text-gray-300 hover:text-white transition-colors">Insurance</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Get in Touch</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">1-800-TRUCKS-1</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">support@alitrucks.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">123 Business Ave, Suite 100<br />San Francisco, CA 94105</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap justify-center md:justify-start space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/cookie-policy" className="text-gray-300 hover:text-white transition-colors">Cookie Policy</Link>
              <Link href="/accessibility" className="text-gray-300 hover:text-white transition-colors">Accessibility</Link>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 AliTrucks. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
