'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'

interface FilterOption {
    id: number
    name: string
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

interface DatabaseFiltersProps {
    onFiltersChange: (filters: FilterState) => void
    onSearch: () => void
}

export default function DatabaseFilters({ onFiltersChange, onSearch }: DatabaseFiltersProps) {
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

    // Filter options from database
    const [vehicleTypes, setVehicleTypes] = useState<FilterOption[]>([])
    const [vehicleCategories, setVehicleCategories] = useState<FilterOption[]>([])
    const [brands, setBrands] = useState<FilterOption[]>([])
    const [models, setModels] = useState<FilterOption[]>([])
    const [fuelTypes, setFuelTypes] = useState<FilterOption[]>([])
    const [locations, setLocations] = useState<string[]>([])

    const supabase = createClient()

    useEffect(() => {
        onFiltersChange(filters)
    }, [filters, onFiltersChange])

    const fetchFilterOptions = useCallback(async () => {
        try {
            // Fetch all filter options in parallel
            const [
                vehicleTypesResult,
                vehicleCategoriesResult,
                brandsResult,
                modelsResult,
                fuelTypesResult,
                locationsResult
            ] = await Promise.all([
                supabase.from('vehicle_types').select('id, name').order('name'),
                supabase.from('vehicle_categories').select('id, name').order('name'),
                supabase.from('brands').select('id, name').order('name'),
                supabase.from('models').select('id, name').order('name'),
                supabase.from('fuel_types').select('id, name').order('name'),
                supabase
                    .from('vehicles')
                    .select('location')
                    .eq('status', 'approved')
                    .not('location', 'is', null)
            ])

            if (vehicleTypesResult.data) setVehicleTypes(vehicleTypesResult.data)
            if (vehicleCategoriesResult.data) setVehicleCategories(vehicleCategoriesResult.data)
            if (brandsResult.data) setBrands(brandsResult.data)
            if (modelsResult.data) setModels(modelsResult.data)
            if (fuelTypesResult.data) setFuelTypes(fuelTypesResult.data)

            // Extract unique locations
            if (locationsResult.data) {
                const uniqueLocations = [...new Set(locationsResult.data.map(v => v.location).filter(Boolean))]
                setLocations(uniqueLocations)
            }
        } catch (error) {
            console.error('Error fetching filter options:', error)
        }
    }, [supabase])

    useEffect(() => {
        fetchFilterOptions()
    }, [fetchFilterOptions])

    const filteredModels = models.filter(model =>
        filters.brand === 'all' || model.id.toString() === filters.brand
    )

    const handleFilterChange = (key: keyof FilterState, value: string | number[]) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            // Reset model when brand changes
            ...(key === 'brand' && { model: 'all' })
        }))
    }

    const handlePriceRangeChange = (value: number[]) => {
        handleFilterChange('priceRange', value)
    }

    const clearFilters = () => {
        setFilters({
            location: '',
            vehicleType: '',
            vehicleCategory: '',
            brand: '',
            model: '',
            fuelType: '',
            priceRange: [0, 1000],
            minYear: '',
            maxCapacity: ''
        })
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Filter Vehicles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Location */}
                <div>
                    <Label htmlFor="location">Location</Label>
                    <Select
                        value={filters.location}
                        onValueChange={(value) => handleFilterChange('location', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All locations</SelectItem>
                            {locations.map((location) => (
                                <SelectItem key={location} value={location}>
                                    {location}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Vehicle Type */}
                <div>
                    <Label htmlFor="vehicleType">Vehicle Type</Label>
                    <Select
                        value={filters.vehicleType}
                        onValueChange={(value) => handleFilterChange('vehicleType', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All types</SelectItem>
                            {vehicleTypes.map((type) => (
                                <SelectItem key={type.id} value={type.id.toString()}>
                                    {type.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Vehicle Category */}
                <div>
                    <Label htmlFor="vehicleCategory">Vehicle Category</Label>
                    <Select
                        value={filters.vehicleCategory}
                        onValueChange={(value) => handleFilterChange('vehicleCategory', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All categories</SelectItem>
                            {vehicleCategories.map((category) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Brand */}
                <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Select
                        value={filters.brand}
                        onValueChange={(value) => handleFilterChange('brand', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All brands</SelectItem>
                            {brands.map((brand) => (
                                <SelectItem key={brand.id} value={brand.id.toString()}>
                                    {brand.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Model */}
                <div>
                    <Label htmlFor="model">Model</Label>
                    <Select
                        value={filters.model}
                        onValueChange={(value) => handleFilterChange('model', value)}
                        disabled={!filters.brand}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All models</SelectItem>
                            {filteredModels.map((model) => (
                                <SelectItem key={model.id} value={model.id.toString()}>
                                    {model.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Fuel Type */}
                <div>
                    <Label htmlFor="fuelType">Fuel Type</Label>
                    <Select
                        value={filters.fuelType}
                        onValueChange={(value) => handleFilterChange('fuelType', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All fuel types</SelectItem>
                            {fuelTypes.map((fuelType) => (
                                <SelectItem key={fuelType.id} value={fuelType.id.toString()}>
                                    {fuelType.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Price Range */}
                <div>
                    <Label>Price Range (per day): ${filters.priceRange[0]} - ${filters.priceRange[1]}</Label>
                    <Slider
                        value={filters.priceRange}
                        min={0}
                        max={1000}
                        step={10}
                        onValueChange={handlePriceRangeChange}
                        className="mt-2"
                    />
                </div>

                {/* Minimum Year */}
                <div>
                    <Label htmlFor="minYear">Minimum Year</Label>
                    <Input
                        id="minYear"
                        type="number"
                        placeholder="e.g. 2020"
                        value={filters.minYear}
                        onChange={(e) => handleFilterChange('minYear', e.target.value)}
                    />
                </div>

                {/* Maximum Weight Capacity */}
                <div>
                    <Label htmlFor="maxCapacity">Max Weight Capacity (lbs)</Label>
                    <Input
                        id="maxCapacity"
                        type="number"
                        placeholder="e.g. 10000"
                        value={filters.maxCapacity}
                        onChange={(e) => handleFilterChange('maxCapacity', e.target.value)}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                    <Button onClick={onSearch} className="flex-1">
                        Search Vehicles
                    </Button>
                    <Button onClick={clearFilters} variant="outline">
                        Clear
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
