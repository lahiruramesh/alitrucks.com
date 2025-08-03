'use client'

// Main imports
import SearchBar from '@/components/SearchBar'
import CompactSearchBar from '@/components/CompactSearchBar'
import TruckCard from '@/components/TruckCard'
import Navigation from '@/components/Navigation'
import DatabaseFilters from '@/components/DatabaseFilters'
import TruckSort, { SortOption } from '@/components/TruckSort'
import { Suspense, useState, useMemo, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { Database } from '@/types/database'

type Vehicle = Database['public']['Tables']['vehicles']['Row']

type VehicleWithDetails = Vehicle & {
  brands: {
    name: string
  } | null
  models: {
    name: string
  } | null
  vehicle_images: {
    image_url: string
    is_primary: boolean
  }[] | null
}

interface FilterState {
  location: string
  vehicleType: string
  vehicleCategory: string
  brand: string
  model: string
  fuelType: string
  priceRange: number[]
  minYear: string
  maxCapacity: string
}

export default function Home() {
  const [vehicles, setVehicles] = useState<VehicleWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    location: 'all',
    vehicleType: 'all',
    vehicleCategory: 'all',
    brand: 'all',
    model: 'all',
    fuelType: 'all',
    priceRange: [0, 1000],
    minYear: '',
    maxCapacity: ''
  })
  const [sortBy, setSortBy] = useState<SortOption>('price-low')
  const [showFilters, setShowFilters] = useState(false)
  const supabase = createClient()

  // Scroll detection for showing filters
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const triggerPoint = 400 // Show filters after scrolling 400px
      setShowFilters(scrollY > triggerPoint)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fetch approved vehicles from the database with filters
  const fetchVehicles = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      let query = supabase
        .from('vehicles')
        .select(`
          *,
          brands (
            name
          ),
          models (
            name
          ),
          vehicle_images (
            image_url,
            is_primary
          )
        `)
        .eq('status', 'approved') // Only fetch approved vehicles

      // Apply filters
      if (filters.location && filters.location !== 'all') {
        query = query.eq('location', filters.location)
      }
      if (filters.vehicleType && filters.vehicleType !== 'all') {
        query = query.eq('vehicle_type_id', parseInt(filters.vehicleType))
      }
      if (filters.vehicleCategory && filters.vehicleCategory !== 'all') {
        query = query.eq('vehicle_category_id', parseInt(filters.vehicleCategory))
      }
      if (filters.brand && filters.brand !== 'all') {
        query = query.eq('brand_id', parseInt(filters.brand))
      }
      if (filters.model && filters.model !== 'all') {
        query = query.eq('model_id', parseInt(filters.model))
      }
      if (filters.fuelType && filters.fuelType !== 'all') {
        query = query.eq('fuel_type_id', parseInt(filters.fuelType))
      }
      if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
        query = query
          .gte('price_per_day', filters.priceRange[0])
          .lte('price_per_day', filters.priceRange[1])
      }
      if (filters.minYear) {
        query = query.gte('year', parseInt(filters.minYear))
      }
      if (filters.maxCapacity) {
        query = query.lte('max_weight_capacity', parseInt(filters.maxCapacity))
      }

      // Apply sorting
      switch (sortBy) {
        case 'price-low':
          query = query.order('price_per_day', { ascending: true })
          break
        case 'price-high':
          query = query.order('price_per_day', { ascending: false })
          break
        case 'rating-high':
          query = query.order('created_at', { ascending: false }) // TODO: Sort by actual rating
          break
        case 'reviews-most':
          query = query.order('created_at', { ascending: false })
          break
        default:
          query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      setVehicles(data as VehicleWithDetails[] || [])
    } catch (err) {
      console.error('Error fetching vehicles:', err)
      setError('Failed to load vehicles. Please try again.')
      setVehicles([])
    } finally {
      setLoading(false)
    }
  }, [filters, sortBy, supabase])

  // Fetch vehicles when filters or sorting changes
  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
  }, [])

  // Handle search action
  const handleSearch = useCallback(() => {
    fetchVehicles()
  }, [fetchVehicles])

  // Transform vehicle data to match truck card expectations
  const transformVehicleToTruck = (vehicle: VehicleWithDetails) => {
    // Get primary image or first image
    const primaryImage = vehicle.vehicle_images?.find(img => img.is_primary)
    const imageUrl = primaryImage?.image_url || vehicle.vehicle_images?.[0]?.image_url || "/api/placeholder/400/300"

    return {
      id: vehicle.id,
      name: vehicle.name,
      image: imageUrl,
      price: vehicle.price_per_day || 0,
      rating: 4.5, // TODO: Calculate actual rating from reviews
      reviews: 0, // TODO: Get actual review count
      location: vehicle.location,
      distance: "2.3 miles away", // TODO: Calculate actual distance
      features: vehicle.key_features || []
    }
  }

  // Transformed vehicles for display
  const trucksData = useMemo(() => {
    return vehicles.map(transformVehicleToTruck)
  }, [vehicles])

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

      {/* Trucks Grid with Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
                onFiltersChange={handleFiltersChange}
                onSearch={handleSearch}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Available Electric Trucks
                </h2>
                <p className="text-gray-600 mt-2">
                  {loading ? 'Loading vehicles...' : `${trucksData.length} trucks available`}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <TruckSort 
                  onSortChange={setSortBy}
                  currentSort={sortBy}
                />
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button 
                  onClick={fetchVehicles}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-80 bg-gray-100 rounded-lg animate-pulse"></div>
                ))}
              </div>
            )}
            
                        {/* Vehicle Grid */}
            {!loading && !error && (
              trucksData.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trucksData.map((truck) => (
                      <TruckCard key={truck.id} truck={truck} />
                    ))}
                  </div>

                  {/* Load More Button - only show if there are more vehicles */}
                  {trucksData.length >= 12 && (
                    <div className="flex justify-center mt-12">
                      <button 
                        onClick={fetchVehicles}
                        className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
                      >
                        Load More Trucks
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No trucks found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search criteria or clearing filters</p>
                  <button 
                    onClick={() => setFilters({
                      location: 'all',
                      vehicleType: 'all',
                      vehicleCategory: 'all',
                      brand: 'all',
                      model: 'all',
                      fuelType: 'all',
                      priceRange: [0, 1000],
                      minYear: '',
                      maxCapacity: ''
                    })}
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      
      {/* Featured Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Electric Trucks?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join the sustainable transportation revolution with our verified fleet of electric trucks.
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
