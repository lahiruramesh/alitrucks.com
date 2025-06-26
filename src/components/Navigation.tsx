'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Search, User, MapPin, Calendar, Users } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-[#FF385C]">
                AliTrucks
              </div>
            </div>

            {/* Search Bar - Always visible */}
            <div 
              className="hidden md:flex items-center bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-all duration-200 px-6 py-2 cursor-pointer min-w-[300px]"
              onClick={() => {
                // Scroll to top to show the main search bar
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium text-gray-900">Anywhere</div>
                <div className="w-px h-6 bg-gray-300"></div>
                <div className="text-sm font-medium text-gray-900">Any week</div>
                <div className="w-px h-6 bg-gray-300"></div>
                <div className="text-sm text-gray-500">Add guests</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-900 hover:text-[#FF385C] font-medium">
                Browse Trucks
              </a>
              <a href="/about" className="text-gray-500 hover:text-gray-900">
                How it works
              </a>
              <a href="/business" className="text-gray-500 hover:text-gray-900">
                For Business
              </a>
            </div>

            {/* Right Side - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-900 hover:bg-gray-100">
                List your truck
              </Button>
              <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-full p-2 hover:shadow-md transition-shadow">
                <Menu className="w-4 h-4 text-gray-500" />
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-6 mt-6">
                    <a href="/" className="text-lg font-medium text-gray-900">
                      Browse Trucks
                    </a>
                    <a href="/about" className="text-lg text-gray-500">
                      How it works
                    </a>
                    <a href="/business" className="text-lg text-gray-500">
                      For Business
                    </a>
                    <hr className="border-gray-200" />
                    <a href="/list" className="text-lg text-gray-900">
                      List your truck
                    </a>
                    <a href="/login" className="text-lg text-gray-900">
                      Log in
                    </a>
                    <a href="/signup" className="text-lg text-gray-900">
                      Sign up
                    </a>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Search - Always visible */}
      <div className="md:hidden fixed top-20 left-4 right-4 z-40">
        <div 
          className="bg-white border border-gray-300 rounded-full shadow-lg p-4 cursor-pointer"
          onClick={() => {
            // Scroll to top to show the main search bar
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          <div className="flex items-center justify-between">
            
          </div>
        </div>
      </div>
    </>
  )
}
