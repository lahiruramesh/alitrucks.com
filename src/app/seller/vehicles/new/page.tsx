'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Upload,
  X,
  Plus,
  ArrowLeft,
  Loader2
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useAuthContext } from '@/components/auth/AuthProvider'
import { useAdminNotifications } from '@/hooks/useAdminNotifications'
import PoliciesDialog from '@/components/PoliciesDialog'
import Link from 'next/link'
import Image from 'next/image'

interface VehicleAttribute {
  id: number
  name: string
}

interface Brand extends VehicleAttribute {
  models?: Model[]
}

interface Model extends VehicleAttribute {
  brand_id: number
}

interface ImageFile {
  file: File
  preview: string
  id: string
  uploading?: boolean
  uploaded?: boolean
  url?: string
}

export default function NewVehiclePage() {
  const router = useRouter()
  const { user } = useAuthContext()
  const { createNotification } = useAdminNotifications()

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    year: new Date().getFullYear(),
    mileage: '',
    location: '',
    vehicle_registration_number: '',
    vehicle_type_id: '',
    vehicle_category_id: '',
    brand_id: '',
    model_id: '',
    fuel_type_id: '',
    price_per_day: '',
    price_per_week: '',
    price_per_month: '',
    max_weight_capacity: '',
    cargo_volume: '',
    range_miles: '',
    charging_time_hours: '',
    pickup_location: '',
    return_location: '',
    fuel_policy_id: '',
    return_policy_id: '',
    cancellation_policy_id: '',
  })

  // New features state
  const [keyFeatures, setKeyFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState('')
  const [specifications, setSpecifications] = useState<Record<string, string>>({})
  const [offers, setOffers] = useState<string[]>([])
  const [newOffer, setNewOffer] = useState('')

  // Attribute data
  const [vehicleTypes, setVehicleTypes] = useState<VehicleAttribute[]>([])
  const [vehicleCategories, setVehicleCategories] = useState<VehicleAttribute[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [fuelTypes, setFuelTypes] = useState<VehicleAttribute[]>([])

  // Image state
  const [images, setImages] = useState<ImageFile[]>([])
  const [primaryImageId, setPrimaryImageId] = useState<string>('')

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const supabase = createClient()

  const fetchAttributes = useCallback(async () => {
    try {
      const [
        typesResult,
        categoriesResult,
        brandsResult,
        modelsResult,
        fuelTypesResult
      ] = await Promise.all([
        supabase.from('vehicle_types').select('*').order('name'),
        supabase.from('vehicle_categories').select('*').order('name'),
        supabase.from('brands').select('*').order('name'),
        supabase.from('models').select('*').order('name'),
        supabase.from('fuel_types').select('*').order('name')
      ])

      if (typesResult.data) setVehicleTypes(typesResult.data)
      if (categoriesResult.data) setVehicleCategories(categoriesResult.data)
      if (brandsResult.data) setBrands(brandsResult.data)
      if (modelsResult.data) setModels(modelsResult.data)
      if (fuelTypesResult.data) setFuelTypes(fuelTypesResult.data)
    } catch (err: unknown) {
      setError('Failed to load form data: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }, [supabase])

  useEffect(() => {
    fetchAttributes()
  }, [fetchAttributes])


  const filteredModels = models.filter(model =>
    model.brand_id === parseInt(formData.brand_id)
  )

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Reset model selection when brand changes
    if (field === 'brand_id') {
      setFormData(prev => ({ ...prev, model_id: '' }))
    }
  }

  const addKeyFeature = () => {
    if (newFeature.trim() && !keyFeatures.includes(newFeature.trim())) {
      setKeyFeatures(prev => [...prev, newFeature.trim()])
      setNewFeature('')
    }
  }

  const removeKeyFeature = (feature: string) => {
    setKeyFeatures(prev => prev.filter(f => f !== feature))
  }

  const addOffer = () => {
    if (newOffer.trim() && !offers.includes(newOffer.trim())) {
      setOffers(prev => [...prev, newOffer.trim()])
      setNewOffer('')
    }
  }

  const removeOffer = (offer: string) => {
    setOffers(prev => prev.filter(o => o !== offer))
  }

  const updateSpecification = (key: string, value: string) => {
    setSpecifications(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const removeSpecification = (key: string) => {
    setSpecifications(prev => {
      const updated = { ...prev }
      delete updated[key]
      return updated
    })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        setError('Please select only image files')
        return
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Image size must be less than 10MB')
        return
      }

      const imageId = Math.random().toString(36).substr(2, 9)
      const imageFile: ImageFile = {
        file,
        preview: URL.createObjectURL(file),
        id: imageId
      }

      setImages(prev => [...prev, imageFile])

      // Set first image as primary
      if (images.length === 0) {
        setPrimaryImageId(imageId)
      }
    })

    // Reset the input
    event.target.value = ''
  }

  const removeImage = (imageId: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== imageId)

      // If removing primary image, set new primary
      if (primaryImageId === imageId && filtered.length > 0) {
        setPrimaryImageId(filtered[0].id)
      } else if (filtered.length === 0) {
        setPrimaryImageId('')
      }

      return filtered
    })
  }

  const uploadImages = async (vehicleId: number) => {
    const uploadPromises = images.map(async (imageFile, index) => {
      const fileExt = imageFile.file.name.split('.').pop()
      const fileName = `${user?.id}/${vehicleId}/${imageFile.id}.${fileExt}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('vehicle-images')
        .upload(fileName, imageFile.file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('vehicle-images')
        .getPublicUrl(fileName)

      // Save to database
      const { error: dbError } = await supabase
        .from('vehicle_images')
        .insert({
          vehicle_id: vehicleId,
          image_url: urlData.publicUrl,
          image_path: fileName,
          file_name: imageFile.file.name,
          file_size: imageFile.file.size,
          mime_type: imageFile.file.type,
          is_primary: imageFile.id === primaryImageId,
          display_order: index,
          alt_text: `${formData.name} - Image ${index + 1}`
        })

      if (dbError) throw dbError
    })

    await Promise.all(uploadPromises)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Validate required fields
      if (!formData.name || !formData.location || !formData.price_per_day || !formData.vehicle_registration_number) {
        throw new Error('Please fill in all required fields')
      }

      if (images.length === 0) {
        throw new Error('Please upload at least one image')
      }

      // Check for duplicate registration number
      const { data: existingVehicle, error: checkError } = await supabase
        .from('vehicles')
        .select('id')
        .eq('vehicle_registration_number', formData.vehicle_registration_number)
        .single()

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
        throw new Error('Error checking registration number: ' + checkError.message)
      }

      if (existingVehicle) {
        throw new Error('This registration number is already in use. Please use a unique registration number.')
      }

      // Create vehicle record
      const vehicleData = {
        seller_id: user!.id, // Use non-null assertion since we check for user above
        name: formData.name,
        description: formData.description,
        year: formData.year,
        mileage: formData.mileage ? parseInt(formData.mileage) : null,
        location: formData.location,
        vehicle_registration_number: formData.vehicle_registration_number,
        vehicle_type_id: formData.vehicle_type_id ? parseInt(formData.vehicle_type_id) : null,
        vehicle_category_id: formData.vehicle_category_id ? parseInt(formData.vehicle_category_id) : null,
        brand_id: formData.brand_id ? parseInt(formData.brand_id) : null,
        model_id: formData.model_id ? parseInt(formData.model_id) : null,
        fuel_type_id: formData.fuel_type_id ? parseInt(formData.fuel_type_id) : null,
        price_per_day: parseFloat(formData.price_per_day),
        price_per_week: formData.price_per_week ? parseFloat(formData.price_per_week) : null,
        price_per_month: formData.price_per_month ? parseFloat(formData.price_per_month) : null,
        max_weight_capacity: formData.max_weight_capacity ? parseInt(formData.max_weight_capacity) : null,
        cargo_volume: formData.cargo_volume ? parseInt(formData.cargo_volume) : null,
        range_miles: formData.range_miles ? parseInt(formData.range_miles) : null,
        charging_time_hours: formData.charging_time_hours ? parseInt(formData.charging_time_hours) : null,
        key_features: keyFeatures.length > 0 ? keyFeatures : null,
        specifications: Object.keys(specifications).length > 0 ? specifications : null,
        offers: offers.length > 0 ? offers : null,
        pickup_location: formData.pickup_location || null,
        return_location: formData.return_location || null,
        fuel_policy_id: formData.fuel_policy_id ? parseInt(formData.fuel_policy_id) : null,
        return_policy_id: formData.return_policy_id ? parseInt(formData.return_policy_id) : null,
        cancellation_policy_id: formData.cancellation_policy_id ? parseInt(formData.cancellation_policy_id) : null,
        status: 'pending'
      }

      const { data: vehicle, error: vehicleError } = await supabase
        .from('vehicles')
        .insert(vehicleData)
        .select()
        .single()

      if (vehicleError) throw vehicleError

      // Upload images
      await uploadImages(vehicle.id)

      // Notify admins of new vehicle submission
      await createNotification(
        'vehicle_submitted',
        'New Vehicle Submission',
        `${user?.email || 'A seller'} has submitted a new vehicle "${formData.name}" (${formData.vehicle_registration_number}) for approval.`,
        {
          vehicleId: vehicle.id,
          vehicleName: formData.name,
          registrationNumber: formData.vehicle_registration_number,
          sellerEmail: user?.email
        }
      )

      setSuccess('Vehicle submitted successfully! It will be reviewed by our team.')

      // Redirect after a delay
      setTimeout(() => {
        router.push('/seller/vehicles')
      }, 2000)

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/seller/vehicles">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Vehicle</h1>
          <p className="text-gray-600 mt-1">List your vehicle for rent on AliTrucks</p>
        </div>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Provide the essential details about your vehicle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Vehicle Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Tesla Semi Electric Truck"
                  required
                />
              </div>
              <div>
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  type="number"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your vehicle, its features, and any special requirements..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., San Francisco, CA"
                  required
                />
              </div>
              <div>
                <Label htmlFor="vehicle_registration_number">Registration Number *</Label>
                <Input
                  id="vehicle_registration_number"
                  value={formData.vehicle_registration_number}
                  onChange={(e) => handleInputChange('vehicle_registration_number', e.target.value)}
                  placeholder="e.g., ABC123XYZ"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter the official vehicle registration number
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mileage">Mileage</Label>
                <Input
                  id="mileage"
                  type="number"
                  min="0"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange('mileage', e.target.value)}
                  placeholder="Current mileage"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Attributes */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Details</CardTitle>
            <CardDescription>
              Select the appropriate categories and specifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehicle_type">Vehicle Type</Label>
                <Select onValueChange={(value) => handleInputChange('vehicle_type_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="vehicle_category">Vehicle Category</Label>
                <Select onValueChange={(value) => handleInputChange('vehicle_category_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Select onValueChange={(value) => handleInputChange('brand_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id.toString()}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="model">Model</Label>
                <Select
                  value={formData.model_id}
                  onValueChange={(value) => handleInputChange('model_id', value)}
                  disabled={!formData.brand_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredModels.map((model) => (
                      <SelectItem key={model.id} value={model.id.toString()}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="fuel_type">Fuel Type</Label>
              <Select onValueChange={(value) => handleInputChange('fuel_type_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  {fuelTypes.map((fuelType) => (
                    <SelectItem key={fuelType.id} value={fuelType.id.toString()}>
                      {fuelType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
            <CardDescription>
              Technical specifications and capabilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="max_weight_capacity">Max Weight Capacity (lbs)</Label>
                <Input
                  id="max_weight_capacity"
                  type="number"
                  min="0"
                  value={formData.max_weight_capacity}
                  onChange={(e) => handleInputChange('max_weight_capacity', e.target.value)}
                  placeholder="e.g., 10000"
                />
              </div>
              <div>
                <Label htmlFor="cargo_volume">Cargo Volume (cubic feet)</Label>
                <Input
                  id="cargo_volume"
                  type="number"
                  min="0"
                  value={formData.cargo_volume}
                  onChange={(e) => handleInputChange('cargo_volume', e.target.value)}
                  placeholder="e.g., 700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="range_miles">Range (miles)</Label>
                <Input
                  id="range_miles"
                  type="number"
                  min="0"
                  value={formData.range_miles}
                  onChange={(e) => handleInputChange('range_miles', e.target.value)}
                  placeholder="e.g., 500"
                />
              </div>
              <div>
                <Label htmlFor="charging_time_hours">Charging Time (hours)</Label>
                <Input
                  id="charging_time_hours"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.charging_time_hours}
                  onChange={(e) => handleInputChange('charging_time_hours', e.target.value)}
                  placeholder="e.g., 8"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
            <CardDescription>
              Set your rental rates (daily rate is required)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price_per_day">Daily Rate ($) *</Label>
                <Input
                  id="price_per_day"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price_per_day}
                  onChange={(e) => handleInputChange('price_per_day', e.target.value)}
                  placeholder="e.g., 249.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="price_per_week">Weekly Rate ($)</Label>
                <Input
                  id="price_per_week"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price_per_week}
                  onChange={(e) => handleInputChange('price_per_week', e.target.value)}
                  placeholder="e.g., 1500.00"
                />
              </div>
              <div>
                <Label htmlFor="price_per_month">Monthly Rate ($)</Label>
                <Input
                  id="price_per_month"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price_per_month}
                  onChange={(e) => handleInputChange('price_per_month', e.target.value)}
                  placeholder="e.g., 5000.00"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Features */}
        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
            <CardDescription>
              Add key features that make your vehicle stand out (e.g., &quot;Autopilot&quot;, &quot;Fast charging&quot;, &quot;All-wheel drive&quot;)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Enter a key feature..."
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyFeature())}
              />
              <Button type="button" onClick={addKeyFeature} disabled={!newFeature.trim()}>
                Add
              </Button>
            </div>
            {keyFeatures.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {keyFeatures.map((feature, index) => (
                  <div key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2">
                    <span className="text-sm">{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeKeyFeature(feature)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vehicle Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Specifications</CardTitle>
            <CardDescription>
              Add custom specifications for your vehicle (e.g., &quot;Battery Type: Lithium-ion&quot;, &quot;Charging Port: CCS&quot;)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Specification name (e.g., Battery Type)"
                id="spec-key"
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Specification value (e.g., Lithium-ion)"
                  id="spec-value"
                />
                <Button
                  type="button"
                  onClick={() => {
                    const keyInput = document.getElementById('spec-key') as HTMLInputElement
                    const valueInput = document.getElementById('spec-value') as HTMLInputElement
                    if (keyInput.value.trim() && valueInput.value.trim()) {
                      updateSpecification(keyInput.value.trim(), valueInput.value.trim())
                      keyInput.value = ''
                      valueInput.value = ''
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
            {Object.keys(specifications).length > 0 && (
              <div className="space-y-2">
                {Object.entries(specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div>
                      <span className="font-medium">{key}:</span> <span className="text-gray-600">{value}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSpecification(key)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Special Offers */}
        <Card>
          <CardHeader>
            <CardTitle>Special Offers</CardTitle>
            <CardDescription>
              Add special offers or amenities (e.g., &quot;Free delivery within 10 miles&quot;, &quot;24/7 roadside assistance&quot;)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newOffer}
                onChange={(e) => setNewOffer(e.target.value)}
                placeholder="Enter a special offer..."
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addOffer())}
              />
              <Button type="button" onClick={addOffer} disabled={!newOffer.trim()}>
                Add
              </Button>
            </div>
            {offers.length > 0 && (
              <div className="space-y-2">
                {offers.map((offer, index) => (
                  <div key={index} className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex items-center justify-between">
                    <span className="text-blue-800">{offer}</span>
                    <button
                      type="button"
                      onClick={() => removeOffer(offer)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pickup and Return Locations */}
        <Card>
          <CardHeader>
            <CardTitle>Pickup & Return Locations</CardTitle>
            <CardDescription>
              Specify where customers can pick up and return the vehicle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pickup_location">Pickup Location</Label>
                <Input
                  id="pickup_location"
                  value={formData.pickup_location}
                  onChange={(e) => handleInputChange('pickup_location', e.target.value)}
                  placeholder="e.g., 123 Main St, San Francisco, CA"
                />
              </div>
              <div>
                <Label htmlFor="return_location">Return Location</Label>
                <Input
                  id="return_location"
                  value={formData.return_location}
                  onChange={(e) => handleInputChange('return_location', e.target.value)}
                  placeholder="Same as pickup or different address"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Policies */}
        <Card>
          <CardHeader>
            <CardTitle>Rental Policies</CardTitle>
            <CardDescription>
              Select the policies that apply to your vehicle rental
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="fuel_policy">Fuel Policy</Label>
                <div className="flex gap-2">
                  <Input
                    id="fuel_policy"
                    value={formData.fuel_policy_id}
                    onChange={(e) => handleInputChange('fuel_policy_id', e.target.value)}
                    placeholder="Select fuel policy"
                    readOnly
                  />
                  <PoliciesDialog
                    policyType="fuel"
                    selectedPolicyId={formData.fuel_policy_id ? parseInt(formData.fuel_policy_id) : undefined}
                    onPolicySelect={(id) => handleInputChange('fuel_policy_id', id.toString())}
                    trigger={<Button type="button" variant="outline" size="sm">Select</Button>}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="return_policy">Return Policy</Label>
                <div className="flex gap-2">
                  <Input
                    id="return_policy"
                    value={formData.return_policy_id}
                    onChange={(e) => handleInputChange('return_policy_id', e.target.value)}
                    placeholder="Select return policy"
                    readOnly
                  />
                  <PoliciesDialog
                    policyType="return"
                    selectedPolicyId={formData.return_policy_id ? parseInt(formData.return_policy_id) : undefined}
                    onPolicySelect={(id) => handleInputChange('return_policy_id', id.toString())}
                    trigger={<Button type="button" variant="outline" size="sm">Select</Button>}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="cancellation_policy">Cancellation Policy</Label>
                <div className="flex gap-2">
                  <Input
                    id="cancellation_policy"
                    value={formData.cancellation_policy_id}
                    onChange={(e) => handleInputChange('cancellation_policy_id', e.target.value)}
                    placeholder="Select cancellation policy"
                    readOnly
                  />
                  <PoliciesDialog
                    policyType="cancellation"
                    selectedPolicyId={formData.cancellation_policy_id ? parseInt(formData.cancellation_policy_id) : undefined}
                    onPolicySelect={(id) => handleInputChange('cancellation_policy_id', id.toString())}
                    trigger={<Button type="button" variant="outline" size="sm">Select</Button>}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Images</CardTitle>
            <CardDescription>
              Upload high-quality images of your vehicle (at least 1 required)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Click to upload images
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, WebP up to 10MB each
                </p>
              </label>
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <Image
                      src={image.preview}
                      alt="Vehicle preview"
                      width={128}
                      height={128}
                      className={`w-full h-32 object-cover rounded-lg border-2 ${image.id === primaryImageId
                        ? 'border-green-500'
                        : 'border-gray-200'
                        }`}
                    />

                    {/* Primary badge */}
                    {image.id === primaryImageId && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        Primary
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      {image.id !== primaryImageId && (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => setPrimaryImageId(image.id)}
                          className="h-6 w-6 p-0 bg-blue-500 hover:bg-blue-600"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => removeImage(image.id)}
                        className="h-6 w-6 p-0 bg-red-500 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/seller/vehicles">Cancel</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Submit for Review
          </Button>
        </div>
      </form>
    </div>
  )
}
