'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Vehicle } from '@/types/database'
import { useAdminNotifications } from '@/hooks/useAdminNotifications'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

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
}

export default function VehicleApprovalPage() {
  const [vehicles, setVehicles] = useState<VehicleWithSeller[]>([])
  const [selectedVehicles, setSelectedVehicles] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('pending')
  const { createNotification } = useAdminNotifications()

  const fetchVehicles = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('vehicles')
      .select(
        `
        *,
        user_profiles (
          full_name,
          email
        ),
        brands (
          name
        ),
        models (
          name
        )
      `
      )
      .in('status', ['pending', 'approved', 'rejected'])
      .order('created_at', { ascending: false })

    if (error) {
      setError('Failed to fetch vehicles for approval.')
      console.error(error)
    } else {
      setVehicles(data as VehicleWithSeller[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  const handleApproval = async (id: string, newStatus: 'approved' | 'rejected', rejectionReason?: string) => {
    setSuccess(null)
    setError(null)
    
    const vehicle = vehicles.find(v => v.id === id)
    if (!vehicle) return

    const { error } = await supabase
      .from('vehicles')
      .update({ 
        status: newStatus, 
        updated_at: new Date().toISOString(),
        rejection_reason: newStatus === 'rejected' ? rejectionReason || 'Vehicle rejected by admin' : null
      })
      .eq('id', id)

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
      .in('id', Array.from(selectedVehicles))

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
      setSelectedVehicles(new Set(filteredVehicles.map(v => v.id)))
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
                  <Card key={vehicle.id}>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        {activeTab === 'pending' && (
                          <Checkbox
                            checked={selectedVehicles.has(vehicle.id)}
                            onCheckedChange={() => toggleVehicleSelection(vehicle.id)}
                          />
                        )}
                        <div>
                          <CardTitle>{vehicle.brands?.name} {vehicle.models?.name}</CardTitle>
                          <CardDescription>Reg: {vehicle.vehicle_registration_number}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold">Seller:</h4>
                        <p>{vehicle.user_profiles?.full_name || 'N/A'} ({vehicle.user_profiles?.email})</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Status:</h4>
                        <Badge variant={
                          vehicle.status === 'approved' ? 'default' : 
                          vehicle.status === 'rejected' ? 'destructive' : 
                          'secondary'
                        }>
                          {vehicle.status}
                        </Badge>
                      </div>
                      {activeTab === 'pending' && !selectedVehicles.has(vehicle.id) && (
                        <div className="flex gap-2 pt-4">
                          <Button 
                            onClick={() => handleApproval(vehicle.id, 'approved')} 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" /> Approve
                          </Button>
                          <Button 
                            onClick={() => handleApproval(vehicle.id, 'rejected')} 
                            size="sm" 
                            variant="destructive"
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
