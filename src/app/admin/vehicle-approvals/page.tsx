'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { Vehicle } from '@/types/database'
import { useAdminNotifications } from '@/hooks/useAdminNotifications'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { CheckCircle, XCircle } from 'lucide-react'
import TruckDetailGallery from '@/components/TruckDetailGallery'

type VehicleWithSeller = Vehicle & {
  user_profiles: {
    full_name: string | null
    email: string
  } | null
  brands: {
    name: string
  } | null
  models: {
    name: string
  } | null
  vehicle_images: {
    id: number
    image_url: string
    is_primary: boolean
    display_order: number
    alt_text: string | null
  }[]
}

export default function VehicleApprovalPage() {
  const [vehicles, setVehicles] = useState<VehicleWithSeller[]>([])
  const [selectedVehicles, setSelectedVehicles] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('pending')
  const { createNotification } = useAdminNotifications()
  const supabase = createClient()

  const fetchVehicles = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('vehicles')
      .select(
        `
        *,
        user_profiles!vehicles_seller_id_fkey (
          full_name,
          email
        ),
        brands!vehicles_brand_id_fkey (
          name
        ),
        models!vehicles_model_id_fkey (
          name
        ),
        vehicle_images (
          id,
          image_url,
          is_primary,
          display_order,
          alt_text
        )
      `
      )
      .in('status', ['pending', 'approved', 'rejected'])
      .order('created_at', { ascending: false })

    if (error) {
      setError('Failed to fetch vehicles for approval.')
      console.error(error)
    } else {
      setVehicles(data as unknown as VehicleWithSeller[])
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  const handleApproval = async (id: string, newStatus: 'approved' | 'rejected', rejectionReason?: string) => {
    setSuccess(null)
    setError(null)
    
    const vehicleId = parseInt(id)
    const vehicle = vehicles.find(v => v.id === vehicleId)
    if (!vehicle) return

    const { error } = await supabase
      .from('vehicles')
      .update({ 
        status: newStatus, 
        updated_at: new Date().toISOString(),
        rejection_reason: newStatus === 'rejected' ? rejectionReason || 'Vehicle rejected by admin' : null
      })
      .eq('id', vehicleId)

    if (error) {
      setError(`Failed to ${newStatus === 'approved' ? 'approve' : 'reject'} vehicle.`)
    } else {
      // Send notification about the decision
      await createNotification(
        newStatus === 'approved' ? 'vehicle_approved' : 'vehicle_rejected',
        `Vehicle ${newStatus === 'approved' ? 'Approved' : 'Rejected'}`,
        `Vehicle "${vehicle.brands?.name} ${vehicle.models?.name}" (${vehicle.vehicle_registration_number}) has been ${newStatus}.`,
        {
          vehicleId: id,
          vehicleName: `${vehicle.brands?.name} ${vehicle.models?.name}`,
          registrationNumber: vehicle.vehicle_registration_number,
          status: newStatus,
          rejectionReason: newStatus === 'rejected' ? rejectionReason : null
        }
      )

      setSuccess(`Vehicle has been successfully ${newStatus === 'approved' ? 'approved' : 'rejected'}.`)
      fetchVehicles()
    }
  }

  const handleBulkApproval = async (newStatus: 'approved' | 'rejected') => {
    if (selectedVehicles.size === 0) return

    setSuccess(null)
    setError(null)
    
    const { error } = await supabase
      .from('vehicles')
      .update({ 
        status: newStatus, 
        updated_at: new Date().toISOString(),
        rejection_reason: newStatus === 'rejected' ? 'Bulk rejection by admin' : null
      })
      .in('id', Array.from(selectedVehicles).map(id => parseInt(id)))

    if (error) {
      setError(`Failed to ${newStatus === 'approved' ? 'approve' : 'reject'} selected vehicles.`)
      console.error(error)
    } else {
      // Send notification about bulk action
      await createNotification(
        newStatus === 'approved' ? 'vehicle_approved' : 'vehicle_rejected',
        `Bulk Vehicle ${newStatus === 'approved' ? 'Approval' : 'Rejection'}`,
        `${selectedVehicles.size} vehicles have been ${newStatus} in a bulk action.`,
        {
          vehicleIds: Array.from(selectedVehicles),
          status: newStatus,
          count: selectedVehicles.size
        }
      )

      setSuccess(`Successfully ${newStatus === 'approved' ? 'approved' : 'rejected'} ${selectedVehicles.size} vehicles.`)
      setSelectedVehicles(new Set())
      fetchVehicles()
    }
  }

  const toggleVehicleSelection = (id: string) => {
    const newSelection = new Set(selectedVehicles)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedVehicles(newSelection)
  }

  const toggleAllVehicles = () => {
    if (selectedVehicles.size === filteredVehicles.length) {
      setSelectedVehicles(new Set())
    } else {
      setSelectedVehicles(new Set(filteredVehicles.map(v => String(v.id))))
    }
  }

  const filteredVehicles = vehicles.filter(v => v.status === activeTab)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Approval Management</CardTitle>
          <CardDescription>Review, approve, or reject vehicle submissions from sellers.</CardDescription>
        </CardHeader>
      </Card>

      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
      {success && <Alert className="border-green-500 text-green-700"><AlertDescription>{success}</AlertDescription></Alert>}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">
            Pending
            {vehicles.filter(v => v.status === 'pending').length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {vehicles.filter(v => v.status === 'pending').length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {activeTab === 'pending' && filteredVehicles.length > 0 && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedVehicles.size === filteredVehicles.length && filteredVehicles.length > 0}
                      onCheckedChange={toggleAllVehicles}
                    />
                    <span className="text-sm text-muted-foreground">
                      {selectedVehicles.size} of {filteredVehicles.length} selected
                    </span>
                  </div>
                  {selectedVehicles.size > 0 && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleBulkApproval('approved')}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve Selected
                      </Button>
                      <Button
                        onClick={() => handleBulkApproval('rejected')}
                        size="sm"
                        variant="destructive"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject Selected
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <p>Loading vehicles...</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredVehicles.length === 0 ? (
                <p>No vehicles in this category.</p>
              ) : (
                filteredVehicles.map(vehicle => (
                  <Card key={vehicle.id} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        {activeTab === 'pending' && (
                          <Checkbox
                            checked={selectedVehicles.has(String(vehicle.id))}
                            onCheckedChange={() => toggleVehicleSelection(String(vehicle.id))}
                          />
                        )}
                        <div>
                          <CardTitle className="text-lg">{vehicle.brands?.name} {vehicle.models?.name}</CardTitle>
                          <CardDescription className="text-sm">
                            Reg: {vehicle.vehicle_registration_number} • {vehicle.year}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    
                    {/* Vehicle Images */}
                    {vehicle.vehicle_images && vehicle.vehicle_images.length > 0 && (
                      <div className="px-6 pb-4">
                        <TruckDetailGallery 
                          images={vehicle.vehicle_images
                            .sort((a: { display_order: number }, b: { display_order: number }) => a.display_order - b.display_order)
                            .map((img: { image_url: string }) => img.image_url)
                          } 
                        />
                      </div>
                    )}
                    
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="font-semibold text-gray-700">Seller:</h4>
                          <p className="text-gray-600">{vehicle.user_profiles?.full_name || 'N/A'}</p>
                          <p className="text-gray-500 text-xs">{vehicle.user_profiles?.email}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700">Status:</h4>
                          <Badge variant={
                            vehicle.status === 'approved' ? 'default' : 
                            vehicle.status === 'rejected' ? 'destructive' : 
                            'secondary'
                          }>
                            {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="font-semibold text-gray-700">Year & Location:</h4>
                          <p className="text-gray-600">{vehicle.year} • {vehicle.location}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700">Daily Rate:</h4>
                          <p className="text-green-600 font-semibold">${vehicle.price_per_day}/day</p>
                        </div>
                      </div>
                      
                      {vehicle.description && (
                        <div>
                          <h4 className="font-semibold text-gray-700 text-sm">Description:</h4>
                          <p className="text-gray-600 text-sm line-clamp-3">{vehicle.description}</p>
                        </div>
                      )}
                      
                      {vehicle.rejection_reason && (
                        <div className="bg-red-50 p-3 rounded-lg">
                          <h4 className="font-semibold text-red-700 text-sm">Rejection Reason:</h4>
                          <p className="text-red-600 text-sm">{vehicle.rejection_reason}</p>
                        </div>
                      )}
                      
                      {activeTab === 'pending' && !selectedVehicles.has(String(vehicle.id)) && (
                        <div className="flex gap-2 pt-4">
                          <Button 
                            onClick={() => handleApproval(String(vehicle.id), 'approved')} 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 flex-1"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" /> Approve
                          </Button>
                          <Button 
                            onClick={() => handleApproval(String(vehicle.id), 'rejected')} 
                            size="sm" 
                            variant="destructive"
                            className="flex-1"
                          >
                            <XCircle className="w-4 h-4 mr-2" /> Reject
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
