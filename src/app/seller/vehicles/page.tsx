'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Search, 
  Eye,
  Edit,
  Trash2,
  Image as ImageIcon,
  MapPin,
  DollarSign,
  Truck
} from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuthContext } from '@/components/auth/AuthProvider'

interface Vehicle {
  id: number
  name: string
  description: string
  year: number
  mileage: number
  location: string
  price_per_day: number
  status: 'pending' | 'approved' | 'rejected' | 'inactive'
  created_at: string
  updated_at: string
  vehicle_images: { id: number; image_url: string; is_primary: boolean }[]
  brands: { name: string }
  models: { name: string }
  vehicle_types: { name: string }
}

export default function SellerVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuthContext()

  useEffect(() => {
    if (user) {
      fetchVehicles()
    }
  }, [user])

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          brands (name),
          models (name),
          vehicle_types (name),
          vehicle_images (id, image_url, is_primary)
        `)
        .eq('seller_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setVehicles(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 text-white">Approved</Badge>
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>
      case 'rejected':
        return <Badge className="bg-red-500 text-white">Rejected</Badge>
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPrimaryImage = (images: any[]) => {
    const primary = images?.find(img => img.is_primary)
    return primary?.image_url || images?.[0]?.image_url || '/api/placeholder/200/150'
  }

  const deleteVehicle = async (vehicleId: number) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return

    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicleId)
        .eq('seller_id', user?.id)

      if (error) throw error
      
      setVehicles(vehicles.filter(v => v.id !== vehicleId))
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Vehicles</h1>
            <p className="text-gray-600 mt-1">Manage your vehicle listings</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Vehicles</h1>
          <p className="text-gray-600 mt-1">Manage your vehicle listings</p>
        </div>
        <Button asChild>
          <Link href="/seller/vehicles/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Vehicle
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search vehicles by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Vehicles Grid */}
      {filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={getPrimaryImage(vehicle.vehicle_images)}
                  alt={vehicle.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  {getStatusBadge(vehicle.status)}
                </div>
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-white/90 text-gray-700">
                    <ImageIcon className="w-3 h-3 mr-1" />
                    {vehicle.vehicle_images?.length || 0}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg truncate">{vehicle.name}</CardTitle>
                    <CardDescription className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {vehicle.location}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {vehicle.year} • {vehicle.brands?.name} {vehicle.models?.name}
                  </span>
                  <div className="flex items-center font-semibold text-green-600">
                    <DollarSign className="w-4 h-4" />
                    {vehicle.price_per_day}/day
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/seller/vehicles/${vehicle.id}`}>
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/seller/vehicles/${vehicle.id}/edit`}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => deleteVehicle(vehicle.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Truck className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No vehicles found</h3>
            <p className="text-gray-500 text-center mb-6">
              {searchTerm ? 'No vehicles match your search criteria.' : 'You haven\'t added any vehicles yet.'}
            </p>
            {!searchTerm && (
              <Button asChild>
                <Link href="/seller/vehicles/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Vehicle
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
