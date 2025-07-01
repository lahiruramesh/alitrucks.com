'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Filter, X, MapPin, Star, Zap, Fuel } from 'lucide-react'

interface FilterOptions {
  priceRange: [number, number]
  location: string[]
  rating: number
  features: string[]
  truckType: string[]
}

interface TruckFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void
  isMobile?: boolean
}

export default function TruckFilters({ onFiltersChange, isMobile = false }: TruckFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 500])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [selectedTruckTypes, setSelectedTruckTypes] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const locations = [
    'San Francisco, CA',
    'Los Angeles, CA', 
    'Oakland, CA',
    'San Jose, CA',
    'Sacramento, CA',
    'Berkeley, CA',
    'Palo Alto, CA',
    'Santa Clara, CA'
  ]

  const features = [
    'Autopilot',
    'Fast charging',
    'All-wheel drive',
    'Long range',
    'Cargo space',
    'Enhanced safety',
    'Climate control',
    'Low maintenance'
  ]

  const truckTypes = [
    'Semi Truck',
    'Delivery Van',
    'Pickup Truck',
    'Box Truck',
    'Refrigerated',
    'Heavy Duty'
  ]

  const toggleLocation = (location: string) => {
    const updated = selectedLocations.includes(location)
      ? selectedLocations.filter(l => l !== location)
      : [...selectedLocations, location]
    setSelectedLocations(updated)
    updateFilters({ location: updated })
  }

  const toggleFeature = (feature: string) => {
    const updated = selectedFeatures.includes(feature)
      ? selectedFeatures.filter(f => f !== feature)
      : [...selectedFeatures, feature]
    setSelectedFeatures(updated)
    updateFilters({ features: updated })
  }

  const toggleTruckType = (type: string) => {
    const updated = selectedTruckTypes.includes(type)
      ? selectedTruckTypes.filter(t => t !== type)
      : [...selectedTruckTypes, type]
    setSelectedTruckTypes(updated)
    updateFilters({ truckType: updated })
  }

  const updateFilters = (updates: Partial<FilterOptions>) => {
    const filters: FilterOptions = {
      priceRange,
      location: selectedLocations,
      rating: minRating,
      features: selectedFeatures,
      truckType: selectedTruckTypes,
      ...updates
    }
    onFiltersChange(filters)
  }

  const clearAllFilters = () => {
    setPriceRange([50, 500])
    setSelectedLocations([])
    setMinRating(0)
    setSelectedFeatures([])
    setSelectedTruckTypes([])
    onFiltersChange({
      priceRange: [50, 500],
      location: [],
      rating: 0,
      features: [],
      truckType: []
    })
  }

  const hasActiveFilters = 
    priceRange[0] > 50 || priceRange[1] < 500 ||
    selectedLocations.length > 0 ||
    minRating > 0 ||
    selectedFeatures.length > 0 ||
    selectedTruckTypes.length > 0

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <span className="text-green-500 mr-2">$</span>
          Price Range
        </h3>
        <div className="px-3">
          <Slider
            value={priceRange}
            onValueChange={(value: number[]) => {
              const newRange = value as [number, number]
              setPriceRange(newRange)
              updateFilters({ priceRange: newRange })
            }}
            max={500}
            min={50}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Location */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <MapPin className="w-4 h-4 text-green-500 mr-2" />
          Location
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {locations.map((location) => (
            <label key={location} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedLocations.includes(location)}
                onChange={() => toggleLocation(location)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">{location}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Star className="w-4 h-4 text-green-500 mr-2" />
          Minimum Rating
        </h3>
        <div className="flex space-x-2">
          {[0, 3, 4, 4.5].map((rating) => (
            <Button
              key={rating}
              variant={minRating === rating ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setMinRating(rating)
                updateFilters({ rating })
              }}
              className="flex items-center space-x-1"
            >
              <Star className="w-3 h-3" />
              <span>{rating === 0 ? 'Any' : `${rating}+`}</span>
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Features */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Zap className="w-4 h-4 text-green-500 mr-2" />
          Features
        </h3>
        <div className="flex flex-wrap gap-2">
          {features.map((feature) => (
            <Badge
              key={feature}
              variant={selectedFeatures.includes(feature) ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-green-50"
              onClick={() => toggleFeature(feature)}
            >
              {feature}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      {/* Truck Type */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Fuel className="w-4 h-4 text-green-500 mr-2" />
          Truck Type
        </h3>
        <div className="flex flex-wrap gap-2">
          {truckTypes.map((type) => (
            <Badge
              key={type}
              variant={selectedTruckTypes.includes(type) ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-green-50"
              onClick={() => toggleTruckType(type)}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <>
          <Separator />
          <Button 
            variant="outline" 
            onClick={clearAllFilters}
            className="w-full"
          >
            <X className="w-4 h-4 mr-2" />
            Clear all filters
          </Button>
        </>
      )}
    </div>
  )

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                !
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter Trucks</SheetTitle>
            <SheetDescription>
              Narrow down your search to find the perfect electric truck
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
              !
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filter Trucks</DialogTitle>
          <DialogDescription>
            Narrow down your search to find the perfect electric truck
          </DialogDescription>
        </DialogHeader>
        <FilterContent />
      </DialogContent>
    </Dialog>
  )
}
