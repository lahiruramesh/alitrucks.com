'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  Search, 
  MapPin, 
  Calendar, 
  Filter, 
  Leaf, 
  Truck, 
  Zap
} from 'lucide-react'
import VehicleSearchResults from './VehicleSearchResults'
import CarbonCalculator from './CarbonCalculator'

interface SearchFilters {
  location: string
  startDate: string
  endDate: string
  vehicleType: string
  fuelType: string
  capacity: number[]
  priceRange: number[]
  ecoFriendlyOnly: boolean
  features: string[]
}

const vehicleTypes = [
  { value: 'pickup', label: 'Pickup Truck' },
  { value: 'cargo_van', label: 'Cargo Van' },
  { value: 'box_truck', label: 'Box Truck' },
  { value: 'flatbed', label: 'Flatbed' },
  { value: 'dump_truck', label: 'Dump Truck' },
  { value: 'refrigerated', label: 'Refrigerated Truck' }
]

const fuelTypes = [
  { value: 'electric', label: 'Electric ⚡', icon: '⚡', carbonSaving: 85 },
  { value: 'hybrid', label: 'Hybrid 🔋', icon: '🔋', carbonSaving: 45 },
  { value: 'diesel', label: 'Diesel', icon: '⛽', carbonSaving: 0 },
  { value: 'gasoline', label: 'Gasoline', icon: '⛽', carbonSaving: 0 }
]

const features = [
  'GPS Navigation',
  'Backup Camera',
  'Climate Control',
  'Bluetooth',
  'Power Steering',
  'ABS Brakes',
  'Airbags',
  'Automatic Transmission'
]

export default function VehicleSearchInterface() {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    startDate: '',
    endDate: '',
    vehicleType: '',
    fuelType: '',
    capacity: [1, 10],
    priceRange: [0, 500],
    ecoFriendlyOnly: false,
    features: []
  })

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [estimatedMiles, setEstimatedMiles] = useState(100)

  const handleSearch = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      // Add all filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '' && value !== 'any' && value !== false) {
          if (Array.isArray(value)) {
            params.append(key, JSON.stringify(value))
          } else {
            params.append(key, value.toString())
          }
        }
      })

      const response = await fetch(`/api/vehicles/search?${params.toString()}`)
      const data = await response.json()
      
      setSearchResults(data.vehicles || [])
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateFilter = (key: keyof SearchFilters, value: string | number | boolean | number[]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const toggleFeature = (feature: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  // Auto-search when location, dates, or eco-friendly filter changes
  useEffect(() => {
    if (filters.location && filters.startDate && filters.endDate) {
      handleSearch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.location, filters.startDate, filters.endDate, filters.ecoFriendlyOnly])

  return (
    <div className="space-y-6">
      {/* Main Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Where do you need the truck?"
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => updateFilter('startDate', e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => updateFilter('endDate', e.target.value)}
                className="pl-10"
                min={filters.startDate}
              />
            </div>
            
            <Button 
              onClick={handleSearch} 
              className="bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              <Search className="w-4 h-4 mr-2" />
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ecoFriendly"
                  checked={filters.ecoFriendlyOnly}
                  onCheckedChange={(checked) => updateFilter('ecoFriendlyOnly', checked)}
                />
                <Label htmlFor="ecoFriendly" className="flex items-center">
                  <Leaf className="w-4 h-4 mr-1 text-green-600" />
                  Eco-friendly only
                </Label>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showAdvancedFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <Card>
          <CardHeader>
            <CardTitle>Advanced Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Vehicle Type */}
              <div className="space-y-2">
                <Label>Vehicle Type</Label>
                <Select value={filters.vehicleType} onValueChange={(value) => updateFilter('vehicleType', value)}>
                  <SelectTrigger>
                    <Truck className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any type</SelectItem>
                    {vehicleTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fuel Type */}
              <div className="space-y-2">
                <Label>Fuel Type</Label>
                <Select value={filters.fuelType} onValueChange={(value) => updateFilter('fuelType', value)}>
                  <SelectTrigger>
                    <Zap className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Any fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any fuel type</SelectItem>
                    {fuelTypes.map(fuel => (
                      <SelectItem key={fuel.value} value={fuel.value}>
                        <div className="flex items-center justify-between w-full">
                          <span>{fuel.label}</span>
                          {fuel.carbonSaving > 0 && (
                            <Badge variant="outline" className="ml-2 text-green-600 border-green-200">
                              -{fuel.carbonSaving}% CO₂
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label>Daily Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}</Label>
                <div className="px-2">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => updateFilter('priceRange', value)}
                    max={500}
                    step={10}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Capacity */}
            <div className="space-y-2">
              <Label>Capacity: {filters.capacity[0]} - {filters.capacity[1]} tons</Label>
              <div className="px-2">
                <Slider
                  value={filters.capacity}
                  onValueChange={(value) => updateFilter('capacity', value)}
                  max={20}
                  step={0.5}
                  className="w-full"
                />
              </div>
            </div>

            <Separator />

            {/* Features */}
            <div className="space-y-3">
              <Label>Features</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {features.map(feature => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={filters.features.includes(feature)}
                      onCheckedChange={() => toggleFeature(feature)}
                    />
                    <Label htmlFor={feature} className="text-sm">
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Carbon Impact Calculator */}
      <CarbonCalculator 
        estimatedMiles={estimatedMiles}
        onMilesChange={setEstimatedMiles}
        fuelType={filters.fuelType}
        startDate={filters.startDate}
        endDate={filters.endDate}
      />

      {/* Search Results */}
      <VehicleSearchResults 
        results={searchResults}
        loading={loading}
        filters={filters}
        estimatedMiles={estimatedMiles}
      />
    </div>
  )
}
