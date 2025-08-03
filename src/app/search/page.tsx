'use client'

import { useEffect, useState } from 'react'
import VehicleSearchInterface from '@/components/search/VehicleSearchInterface'
import DatabaseFilters from '@/components/DatabaseFilters'

export default function VehicleSearchPage() {
  const [showFilters, setShowFilters] = useState(false)

  // Scroll detection for showing filters
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const triggerPoint = 300 // Show filters after scrolling 300px
      setShowFilters(scrollY > triggerPoint)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 via-green-700 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Electric Truck</h1>
          <p className="text-xl text-green-100">
            Rent eco-friendly trucks and make a positive impact on the environment
          </p>
        </div>
      </div>
      
      {/* Search Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 transition-all duration-300 ${
            showFilters 
              ? 'lg:sticky lg:top-6 lg:h-fit' 
              : 'opacity-0 lg:opacity-100'
          }`}>
            <div className={`transition-all duration-300 ${
              showFilters ? 'block' : 'hidden lg:block'
            }`}>
              <DatabaseFilters 
                onFiltersChange={() => {}}
                onSearch={() => {}}
              />
            </div>
          </div>

          {/* Main Search Interface */}
          <div className="lg:col-span-3">
            <VehicleSearchInterface />
          </div>
        </div>
      </div>
    </div>
  )
}
