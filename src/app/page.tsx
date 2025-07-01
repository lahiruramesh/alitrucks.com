'use client'

// Main imports
import SearchBar from '@/components/SearchBar'
import CompactSearchBar from '@/components/CompactSearchBar'
import TruckCard from '@/components/TruckCard'
import Navigation from '@/components/Navigation'
import TruckFilters from '@/components/TruckFilters'
import TruckSort, { SortOption } from '@/components/TruckSort'
import { Suspense, useState, useMemo, useEffect } from 'react'

// Dummy truck data
const trucks = [
  {
    id: 1,
    name: "Tesla Semi Electric Truck",
    image: "/api/placeholder/400/300",
    price: 249,
    rating: 4.9,
    reviews: 128,
    location: "San Francisco, CA",
    distance: "2.3 miles away",
    features: ["Autopilot", "500 mile range", "Fast charging"]
  },
  {
    id: 2,
    name: "Rivian Electric Delivery Van",
    image: "/api/placeholder/350/250",
    price: 189,
    rating: 4.8,
    reviews: 95,
    location: "Oakland, CA",
    distance: "5.1 miles away",
    features: ["All-wheel drive", "400 mile range", "Cargo space"]
  },
  {
    id: 3,
    name: "Ford E-Transit Electric Van",
    image: "/api/placeholder/320/240",
    price: 179,
    rating: 4.7,
    reviews: 67,
    location: "San Jose, CA",
    distance: "8.2 miles away",
    features: ["Pro Power Onboard", "126 mile range", "Fleet ready"]
  },
  {
    id: 4,
    name: "Mercedes eSprinter",
    image: "/api/placeholder/380/280",
    price: 219,
    rating: 4.8,
    reviews: 84,
    location: "Palo Alto, CA",
    distance: "4.7 miles away",
    features: ["MBUX system", "273 mile range", "Premium interior"]
  },
  {
    id: 5,
    name: "Volvo FE Electric",
    image: "/api/placeholder/360/270",
    price: 199,
    rating: 4.6,
    reviews: 76,
    location: "Berkeley, CA",
    distance: "6.8 miles away",
    features: ["Quiet operation", "200 mile range", "Safety systems"]
  },
  {
    id: 6,
    name: "BYD T3 Electric Truck",
    image: "/api/placeholder/340/260",
    price: 159,
    rating: 4.5,
    reviews: 52,
    location: "Fremont, CA",
    distance: "9.2 miles away",
    features: ["Iron phosphate battery", "150 mile range", "Compact design"]
  },
  {
    id: 7,
    name: "Isuzu NPR-EV Electric",
    image: "/api/placeholder/420/320",
    price: 169,
    rating: 4.4,
    reviews: 43,
    location: "San Mateo, CA",
    distance: "7.5 miles away",
    features: ["Class 4 truck", "120 mile range", "Low maintenance"]
  },
  {
    id: 8,
    name: "Peterbilt 579EV",
    image: "/api/placeholder/390/290",
    price: 299,
    rating: 4.9,
    reviews: 67,
    location: "Santa Clara, CA",
    distance: "5.4 miles away",
    features: ["Long haul capable", "400 mile range", "Advanced telematics"]
  }
]

export default function Home() {
  const [filters, setFilters] = useState({
    priceRange: [50, 500] as [number, number],
    location: [] as string[],
    rating: 0,
    features: [] as string[],
    truckType: [] as string[]
  })
  const [sortBy, setSortBy] = useState<SortOption>('price-low')
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const filteredAndSortedTrucks = useMemo(() => {
    const filtered = trucks.filter(truck => {
      // Price filter
      if (truck.price < filters.priceRange[0] || truck.price > filters.priceRange[1]) {
        return false
      }

      // Location filter
      if (filters.location.length > 0 && !filters.location.includes(truck.location)) {
        return false
      }

      // Rating filter
      if (filters.rating > 0 && truck.rating < filters.rating) {
        return false
      }

      // Features filter
      if (filters.features.length > 0) {
        const hasAllFeatures = filters.features.every(feature => 
          truck.features.some(truckFeature => 
            truckFeature.toLowerCase().includes(feature.toLowerCase())
          )
        )
        if (!hasAllFeatures) return false
      }

      return true
    })

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating-high':
          return b.rating - a.rating
        case 'rating-low':
          return a.rating - b.rating
        case 'distance-near':
          return parseFloat(a.distance) - parseFloat(b.distance)
        case 'distance-far':
          return parseFloat(b.distance) - parseFloat(a.distance)
        case 'reviews-most':
          return b.reviews - a.reviews
        case 'reviews-least':
          return a.reviews - b.reviews
        default:
          return 0
      }
    })

    return filtered
  }, [filters, sortBy])

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <CompactSearchBar onSearch={(data) => console.log('Compact search:', data)} />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Rent Electric Trucks
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Find the perfect electric truck for your business needs. Sustainable, efficient, and reliable transportation solutions.
            </p>
          </div>
          
          {/* Search Bar */}
          <Suspense fallback={<div className="h-20 bg-gray-100 rounded-full animate-pulse"></div>}>
            <SearchBar />
          </Suspense>
        </div>
      </div>

      {/* Trucks Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Available Electric Trucks
            </h2>
            <p className="text-gray-600 mt-2">
              {filteredAndSortedTrucks.length} trucks available {filters.location.length > 0 ? 'in selected areas' : 'in your area'}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <TruckFilters 
              onFiltersChange={setFilters} 
              isMobile={isMobile}
            />
            <TruckSort 
              onSortChange={setSortBy}
              currentSort={sortBy}
            />
          </div>
        </div>
        
        {filteredAndSortedTrucks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedTrucks.map((truck) => (
                <TruckCard key={truck.id} truck={truck} />
              ))}
            </div>

            {/* Load More Button - only show if there are more trucks in the original array */}
            {filteredAndSortedTrucks.length === trucks.length && trucks.length >= 8 && (
              <div className="flex justify-center mt-12">
                <button className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-full transition-colors">
                  Load more trucks
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No trucks found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
            <button 
              onClick={() => setFilters({
                priceRange: [50, 500],
                location: [],
                rating: 0,
                features: [],
                truckType: []
              })}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose AliTrucks?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The sustainable future of transportation is here
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">100% Electric</h3>
              <p className="text-gray-600">Zero emissions, maximum efficiency for a sustainable future</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fully Verified</h3>
              <p className="text-gray-600">All trucks are inspected and maintained to the highest standards</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock assistance for all your rental needs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
