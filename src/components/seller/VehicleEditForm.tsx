'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Database } from '@/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

type Vehicle = Database['public']['Tables']['vehicles']['Row'] & {
  brands?: { id: number; name: string }
  models?: { id: number; name: string }
  vehicle_types?: { id: number; name: string }
  vehicle_categories?: { id: number; name: string }
  fuel_types?: { id: number; name: string }
  vehicle_images?: {
    id: number
    image_url: string
    is_primary: boolean | null
    display_order: number | null
    alt_text: string | null
  }[]
}

interface VehicleEditFormProps {
  vehicle: Vehicle
  formData: {
    brands: Database['public']['Tables']['brands']['Row'][]
    models: Database['public']['Tables']['models']['Row'][]
    vehicleTypes: Database['public']['Tables']['vehicle_types']['Row'][]
    vehicleCategories: Database['public']['Tables']['vehicle_categories']['Row'][]
    fuelTypes: Database['public']['Tables']['fuel_types']['Row'][]
  }
}

export function VehicleEditForm({ vehicle, formData }: VehicleEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formState, setFormState] = useState({
    name: vehicle.name || '',
    description: vehicle.description || '',
    brand_id: vehicle.brand_id?.toString() || '',
    model_id: vehicle.model_id?.toString() || '',
    vehicle_type_id: vehicle.vehicle_type_id?.toString() || '',
    vehicle_category_id: vehicle.vehicle_category_id?.toString() || '',
    fuel_type_id: vehicle.fuel_type_id?.toString() || '',
    year: vehicle.year?.toString() || '',
    cargo_volume: vehicle.cargo_volume?.toString() || '',
    max_weight_capacity: vehicle.max_weight_capacity?.toString() || '',
    price_per_day: vehicle.price_per_day?.toString() || '',
    location: vehicle.location || '',
    vehicle_registration_number: vehicle.vehicle_registration_number || '',
    key_features: Array.isArray(vehicle.key_features) ? vehicle.key_features.join(', ') : '',
    mileage: vehicle.mileage?.toString() || '',
  })

  const handleInputChange = (field: string, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      
      // Convert form data to proper types
      const updateData = {
        name: formState.name,
        description: formState.description,
        brand_id: formState.brand_id ? parseInt(formState.brand_id) : undefined,
        model_id: formState.model_id ? parseInt(formState.model_id) : undefined,
        vehicle_type_id: formState.vehicle_type_id ? parseInt(formState.vehicle_type_id) : undefined,
        vehicle_category_id: formState.vehicle_category_id ? parseInt(formState.vehicle_category_id) : undefined,
        fuel_type_id: formState.fuel_type_id ? parseInt(formState.fuel_type_id) : undefined,
        year: formState.year ? parseInt(formState.year) : undefined,
        cargo_volume: formState.cargo_volume ? parseFloat(formState.cargo_volume) : undefined,
        max_weight_capacity: formState.max_weight_capacity ? parseFloat(formState.max_weight_capacity) : undefined,
        price_per_day: formState.price_per_day ? parseFloat(formState.price_per_day) : undefined,
        location: formState.location,
        vehicle_registration_number: formState.vehicle_registration_number,
        key_features: formState.key_features ? formState.key_features.split(',').map((f: string) => f.trim()).filter((f: string) => f) : [],
        mileage: formState.mileage ? parseFloat(formState.mileage) : undefined,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('vehicles')
        .update(updateData)
        .eq('id', vehicle.id)

      if (error) {
        throw error
      }

      router.push(`/seller/vehicles/${vehicle.id}`)
    } catch (error) {
      console.error('Error updating vehicle:', error)
      alert('Failed to update vehicle. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Filter models based on selected brand
  const filteredModels = formData.models.filter(model => 
    formState.brand_id === '' || model.brand_id.toString() === formState.brand_id
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/seller/vehicles/${vehicle.id}`}>
          <Button type="button" variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Vehicle
          </Button>
        </Link>
        <Button type="submit" disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Vehicle Name</Label>
              <Input
                id="name"
                value={formState.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="vehicle_registration_number">Registration Number</Label>
              <Input
                id="vehicle_registration_number"
                value={formState.vehicle_registration_number}
                onChange={(e) => handleInputChange('vehicle_registration_number', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              value={formState.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Details */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brand_id">Brand</Label>
              <Select value={formState.brand_id} onValueChange={(value) => {
                handleInputChange('brand_id', value)
                handleInputChange('model_id', '') // Reset model when brand changes
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {formData.brands.map(brand => (
                    <SelectItem key={brand.id} value={brand.id.toString()}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="model_id">Model</Label>
              <Select value={formState.model_id} onValueChange={(value) => handleInputChange('model_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {filteredModels.map(model => (
                    <SelectItem key={model.id} value={model.id.toString()}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="vehicle_type_id">Vehicle Type</Label>
              <Select value={formState.vehicle_type_id} onValueChange={(value) => handleInputChange('vehicle_type_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {formData.vehicleTypes.map(type => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="vehicle_category_id">Vehicle Category</Label>
              <Select value={formState.vehicle_category_id} onValueChange={(value) => handleInputChange('vehicle_category_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {formData.vehicleCategories.map(category => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fuel_type_id">Fuel Type</Label>
              <Select value={formState.fuel_type_id} onValueChange={(value) => handleInputChange('fuel_type_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  {formData.fuelTypes.map(fuelType => (
                    <SelectItem key={fuelType.id} value={fuelType.id.toString()}>
                      {fuelType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                min="1900"
                max="2030"
                value={formState.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>Specifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cargo_volume">Cargo Volume (cubic feet)</Label>
              <Input
                id="cargo_volume"
                type="number"
                min="0"
                step="0.1"
                value={formState.cargo_volume}
                onChange={(e) => handleInputChange('cargo_volume', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="max_weight_capacity">Max Weight Capacity (kg)</Label>
              <Input
                id="max_weight_capacity"
                type="number"
                min="0"
                step="0.1"
                value={formState.max_weight_capacity}
                onChange={(e) => handleInputChange('max_weight_capacity', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="mileage">Mileage (miles)</Label>
              <Input
                id="mileage"
                type="number"
                min="0"
                step="0.1"
                value={formState.mileage}
                onChange={(e) => handleInputChange('mileage', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="key_features">Key Features (comma-separated)</Label>
            <Textarea
              id="key_features"
              rows={3}
              value={formState.key_features}
              onChange={(e) => handleInputChange('key_features', e.target.value)}
              placeholder="e.g. GPS, Air Conditioning, Bluetooth"
            />
          </div>
        </CardContent>
      </Card>

      {/* Pricing & Location */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing & Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price_per_day">Price per Day ($)</Label>
              <Input
                id="price_per_day"
                type="number"
                min="0"
                step="0.01"
                value={formState.price_per_day}
                onChange={(e) => handleInputChange('price_per_day', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formState.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
