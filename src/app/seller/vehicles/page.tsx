'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { Database } from '@/types/database'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, XCircle, Clock, Edit, Eye, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

type Vehicle = Database['public']['Tables']['vehicles']['Row']

type VehicleWithDetails = Vehicle & {
  brands: {
    name: string
  } | null
  models: {
    name: string
  } | null
}

export default function SellerVehiclesPage() {
  const [vehicles, setVehicles] = useState<VehicleWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  const { user } = useAuth()
  const supabase = createClient()

  const fetchVehicles = useCallback(async () => {
    if (!user?.id) return
    
    setLoading(true)
    const { data, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        brands (
          name
        ),
        models (
          name
        )
      `)
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      setError('Failed to fetch your vehicles.')
      console.error(error)
    } else {
      setVehicles(data as VehicleWithDetails[])
    }
    setLoading(false)
  }, [user?.id, supabase])

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusVariant = (status: string): "default" | "destructive" | "secondary" => {
    switch (status) {
      case 'approved':
        return 'default'
      case 'rejected':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    if (activeTab === 'all') return true
    return vehicle.status === activeTab
  })

  const getVehicleCount = (status: string) => {
    if (status === 'all') return vehicles.length
    return vehicles.filter(v => v.status === status).length
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Vehicles</h1>
          <p className="text-gray-600 mt-1">View and manage your vehicle listings and their approval status</p>
        </div>
        <Button asChild>
          <Link href="/seller/vehicles/new">
            Add New Vehicle
          </Link>
        </Button>
      </div>

      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            All Vehicles
            {getVehicleCount('all') > 0 && (
              <Badge variant="outline" className="ml-2">
                {getVehicleCount('all')}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            {getVehicleCount('pending') > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getVehicleCount('pending')}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved
            {getVehicleCount('approved') > 0 && (
              <Badge variant="default" className="ml-2">
                {getVehicleCount('approved')}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected
            {getVehicleCount('rejected') > 0 && (
              <Badge variant="destructive" className="ml-2">
                {getVehicleCount('rejected')}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading vehicles...</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredVehicles.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <AlertTriangle className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {activeTab === 'all' ? 'No vehicles found' : `No ${activeTab} vehicles`}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {activeTab === 'all' 
                      ? "You haven't added any vehicles yet." 
                      : `You don't have any ${activeTab} vehicles.`
                    }
                  </p>
                  {activeTab === 'all' && (
                    <Button asChild>
                      <Link href="/seller/vehicles/new">
                        Add Your First Vehicle
                      </Link>
                    </Button>
                  )}
                </div>
              ) : (
                filteredVehicles.map(vehicle => (
                  <Card key={vehicle.id} className="relative">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            {getStatusIcon(vehicle.status)}
                            {vehicle.brands?.name} {vehicle.models?.name}
                          </CardTitle>
                          <CardDescription>
                            Reg: {vehicle.vehicle_registration_number}
                          </CardDescription>
                        </div>
                        <Badge variant={getStatusVariant(vehicle.status)} className="ml-2">
                          {vehicle.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Year:</span>
                          <span className="font-medium">{vehicle.year}</span>
                        </div>
                        {/* <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Color:</span>
                          <span className="font-medium">{vehicle.color}</span>
                        </div> */}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Price per day:</span>
                          <span className="font-medium">${vehicle.price_per_day}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium">{vehicle.location}</span>
                        </div>
                      </div>

                      {vehicle.status === 'rejected' && vehicle.rejection_reason && (
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Rejection Reason:</strong> {vehicle.rejection_reason}
                          </AlertDescription>
                        </Alert>
                      )}

                      {vehicle.status === 'pending' && (
                        <Alert>
                          <Clock className="h-4 w-4" />
                          <AlertDescription>
                            Your vehicle is under review. You&apos;ll be notified once it&apos;s approved or if any changes are needed.
                          </AlertDescription>
                        </Alert>
                      )}

                      {vehicle.status === 'approved' && (
                        <Alert className="border-green-500 bg-green-50">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-700">
                            Your vehicle is approved and visible to customers.
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" asChild className="flex-1">
                          <Link href={`/seller/vehicles/${vehicle.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild className="flex-1">
                          <Link href={`/seller/vehicles/${vehicle.id}/edit`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Link>
                        </Button>
                      </div>
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
