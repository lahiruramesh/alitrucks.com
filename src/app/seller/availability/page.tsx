'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar, Plus, Edit, Trash2, Loader2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'

interface Vehicle {
  id: number
  name: string
  status: string
  brands: { name: string } | null
  models: { name: string } | null
}

interface VehicleAvailability {
  id: number
  vehicle_id: number
  start_date: string
  end_date: string
  is_available: boolean
  special_price_per_day: number | null
  notes: string | null
  vehicles: {
    name: string
    brands: { name: string } | null
    models: { name: string } | null
  }
}

export default function SellerAvailabilityPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [availabilities, setAvailabilities] = useState<VehicleAvailability[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAvailability, setEditingAvailability] = useState<VehicleAvailability | null>(null)
  
  const [formData, setFormData] = useState({
    vehicle_id: '',
    start_date: '',
    end_date: '',
    is_available: true,
    special_price_per_day: '',
    notes: ''
  })

  const { user } = useAuth()
  const supabase = createClient()

  const fetchVehicles = useCallback(async () => {
    if (!user?.id) return

    const { data, error } = await supabase
      .from('vehicles')
      .select(`
        id,
        name,
        status,
        brands!vehicles_brand_id_fkey (name),
        models!vehicles_model_id_fkey (name)
      `)
      .eq('seller_id', user.id)
      .eq('status', 'approved')

    if (error) {
      setError('Failed to fetch vehicles')
      console.error('Error fetching vehicles:', error)
    } else {
      setVehicles((data as Vehicle[]) || [])
    }
  }, [user?.id, supabase])

  const fetchAvailabilities = useCallback(async () => {
    if (!user?.id) return

    const { data, error } = await supabase
      .from('vehicle_availability')
      .select(`
        *,
        vehicles!inner (
          name,
          seller_id,
          brands (name),
          models (name)
        )
      `)
      .eq('vehicles.seller_id', user.id)
      .order('start_date', { ascending: true })

    if (error) {
      setError('Failed to fetch availability data')
      console.error('Error fetching availabilities:', error)
    } else {
      setAvailabilities((data || []).map(item => ({
        ...item,
        is_available: item.is_available ?? true
      })))
    }
  }, [user?.id, supabase])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchVehicles(), fetchAvailabilities()])
      setLoading(false)
    }
    loadData()
  }, [fetchVehicles, fetchAvailabilities])

  const resetForm = () => {
    setFormData({
      vehicle_id: '',
      start_date: '',
      end_date: '',
      is_available: true,
      special_price_per_day: '',
      notes: ''
    })
    setEditingAvailability(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.vehicle_id || !formData.start_date || !formData.end_date) {
      setError('Please fill in all required fields')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const availabilityData = {
        vehicle_id: parseInt(formData.vehicle_id),
        start_date: formData.start_date,
        end_date: formData.end_date,
        is_available: formData.is_available,
        special_price_per_day: formData.special_price_per_day ? parseFloat(formData.special_price_per_day) : null,
        notes: formData.notes || null
      }

      if (editingAvailability) {
        const { error } = await supabase
          .from('vehicle_availability')
          .update(availabilityData)
          .eq('id', editingAvailability.id)

        if (error) throw error
        setSuccess('Availability updated successfully')
      } else {
        const { error } = await supabase
          .from('vehicle_availability')
          .insert([availabilityData])

        if (error) throw error
        setSuccess('Availability created successfully')
      }

      await fetchAvailabilities()
      setIsDialogOpen(false)
      resetForm()
    } catch (error: unknown) {
      setError((error as Error).message || 'Failed to save availability')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (availability: VehicleAvailability) => {
    setEditingAvailability(availability)
    setFormData({
      vehicle_id: availability.vehicle_id.toString(),
      start_date: availability.start_date,
      end_date: availability.end_date,
      is_available: availability.is_available,
      special_price_per_day: availability.special_price_per_day?.toString() || '',
      notes: availability.notes || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this availability record?')) return

    try {
      const { error } = await supabase
        .from('vehicle_availability')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setSuccess('Availability deleted successfully')
      await fetchAvailabilities()
    } catch (error: unknown) {
      setError((error as Error).message || 'Failed to delete availability')
    }
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    resetForm()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Availability Management</h1>
          <p className="text-gray-600 mt-1">Manage when your vehicles are available for rent</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Availability
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingAvailability ? 'Edit Availability' : 'Add Availability Period'}
              </DialogTitle>
              <DialogDescription>
                Set availability periods for your vehicles. You can mark periods as unavailable for maintenance or special pricing.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle">Vehicle *</Label>
                  <Select
                    value={formData.vehicle_id}
                    onValueChange={(value) => setFormData({...formData, vehicle_id: value})}
                    disabled={!!editingAvailability}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                          {vehicle.name} ({vehicle.brands?.name} {vehicle.models?.name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Select
                    value={formData.is_available.toString()}
                    onValueChange={(value) => setFormData({...formData, is_available: value === 'true'})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Available</SelectItem>
                      <SelectItem value="false">Blocked/Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date *</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    required
                  />
                </div>
              </div>

              {formData.is_available && (
                <div className="space-y-2">
                  <Label htmlFor="special_price">Special Price per Day (optional)</Label>
                  <Input
                    id="special_price"
                    type="number"
                    step="0.01"
                    value={formData.special_price_per_day}
                    onChange={(e) => setFormData({...formData, special_price_per_day: e.target.value})}
                    placeholder="Override default pricing"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Internal notes about this availability period"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingAvailability ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Availability List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Availability Schedule
          </CardTitle>
          <CardDescription>
            View and manage your vehicle availability periods
          </CardDescription>
        </CardHeader>
        <CardContent>
          {availabilities.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No availability periods set</h3>
              <p className="text-gray-500 mb-4">
                Start by creating availability periods for your vehicles.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {availabilities.map((availability) => (
                <div
                  key={availability.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">
                        {availability.vehicles.name}
                      </h4>
                      <Badge variant={availability.is_available ? "default" : "secondary"}>
                        {availability.is_available ? 'Available' : 'Blocked'}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>
                        {format(parseISO(availability.start_date), 'MMM dd, yyyy')} - {format(parseISO(availability.end_date), 'MMM dd, yyyy')}
                      </p>
                      {availability.special_price_per_day && (
                        <p className="text-green-600 font-medium">
                          Special Price: ${availability.special_price_per_day}/day
                        </p>
                      )}
                      {availability.notes && (
                        <p className="text-gray-500 mt-1">{availability.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(availability)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(availability.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
