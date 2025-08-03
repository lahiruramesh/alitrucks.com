'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DollarSign, TrendingUp, Edit, Loader2, Calculator } from 'lucide-react'

interface Vehicle {
  id: number
  name: string
  price_per_day: number | null
  price_per_week: number | null
  price_per_month: number | null
  brands: { name: string }[] | null
  models: { name: string }[] | null
}

export default function SellerPricingPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  
  const [formData, setFormData] = useState({
    price_per_day: '',
    price_per_week: '',
    price_per_month: ''
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
        price_per_day,
        price_per_week,
        price_per_month,
        brands!vehicles_brand_id_fkey (name),
        models!vehicles_model_id_fkey (name)
      `)
      .eq('seller_id', user.id)
      .eq('status', 'approved')
      .order('name')

    if (error) {
      setError('Failed to fetch vehicles')
      console.error('Error fetching vehicles:', error)
    } else {
      setVehicles((data as Vehicle[]) || [])
    }
  }, [user?.id, supabase])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await fetchVehicles()
      setLoading(false)
    }
    loadData()
  }, [fetchVehicles])

  const resetForm = () => {
    setFormData({
      price_per_day: '',
      price_per_week: '',
      price_per_month: ''
    })
    setEditingVehicle(null)
  }

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setFormData({
      price_per_day: vehicle.price_per_day?.toString() || '',
      price_per_week: vehicle.price_per_week?.toString() || '',
      price_per_month: vehicle.price_per_month?.toString() || ''
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingVehicle) return

    setSaving(true)
    setError(null)

    try {
      const pricingData = {
        price_per_day: formData.price_per_day ? parseFloat(formData.price_per_day) : null,
        price_per_week: formData.price_per_week ? parseFloat(formData.price_per_week) : null,
        price_per_month: formData.price_per_month ? parseFloat(formData.price_per_month) : null
      }

      const { error } = await supabase
        .from('vehicles')
        .update(pricingData)
        .eq('id', editingVehicle.id)

      if (error) throw error

      setSuccess('Pricing updated successfully')
      await fetchVehicles()
      setIsDialogOpen(false)
      resetForm()
    } catch (error: unknown) {
      setError((error as Error).message || 'Failed to update pricing')
    } finally {
      setSaving(false)
    }
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    resetForm()
  }

  const calculateDiscounts = () => {
    const daily = parseFloat(formData.price_per_day) || 0
    if (daily > 0) {
      const weeklyDiscount = Math.round((daily * 7 * 0.9) * 100) / 100 // 10% discount
      const monthlyDiscount = Math.round((daily * 30 * 0.8) * 100) / 100 // 20% discount
      
      setFormData({
        ...formData,
        price_per_week: weeklyDiscount.toString(),
        price_per_month: monthlyDiscount.toString()
      })
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Pricing Management</h1>
          <p className="text-gray-600 mt-1">Set competitive rates and manage pricing strategies</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Pricing - {editingVehicle?.name}</DialogTitle>
              <DialogDescription>
                Set your vehicle pricing for different rental periods. Longer periods typically offer discounts.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price_per_day">Daily Rate ($)</Label>
                <Input
                  id="price_per_day"
                  type="number"
                  step="0.01"
                  value={formData.price_per_day}
                  onChange={(e) => setFormData({...formData, price_per_day: e.target.value})}
                  placeholder="0.00"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={calculateDiscounts}
                  disabled={!formData.price_per_day}
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Auto-calculate discounts
                </Button>
                <span className="text-sm text-gray-500">
                  (10% weekly, 20% monthly discount)
                </span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price_per_week">Weekly Rate ($)</Label>
                <Input
                  id="price_per_week"
                  type="number"
                  step="0.01"
                  value={formData.price_per_week}
                  onChange={(e) => setFormData({...formData, price_per_week: e.target.value})}
                  placeholder="0.00"
                />
                {formData.price_per_day && formData.price_per_week && (
                  <p className="text-sm text-gray-500">
                    {((parseFloat(formData.price_per_week) / (parseFloat(formData.price_per_day) * 7)) * 100 - 100).toFixed(1)}% 
                    {parseFloat(formData.price_per_week) < parseFloat(formData.price_per_day) * 7 ? ' discount' : ' markup'} vs daily rate
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price_per_month">Monthly Rate ($)</Label>
                <Input
                  id="price_per_month"
                  type="number"
                  step="0.01"
                  value={formData.price_per_month}
                  onChange={(e) => setFormData({...formData, price_per_month: e.target.value})}
                  placeholder="0.00"
                />
                {formData.price_per_day && formData.price_per_month && (
                  <p className="text-sm text-gray-500">
                    {((parseFloat(formData.price_per_month) / (parseFloat(formData.price_per_day) * 30)) * 100 - 100).toFixed(1)}% 
                    {parseFloat(formData.price_per_month) < parseFloat(formData.price_per_day) * 30 ? ' discount' : ' markup'} vs daily rate
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Update Pricing
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

      {/* Pricing Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Pricing Overview
          </CardTitle>
          <CardDescription>
            Monitor and optimize your vehicle pricing across different rental periods
          </CardDescription>
        </CardHeader>
        <CardContent>
          {vehicles.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles available</h3>
              <p className="text-gray-500">
                Add and approve vehicles to start setting pricing.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{vehicle.name}</h4>
                      {vehicle.brands?.[0]?.name && (
                        <Badge variant="outline">
                          {vehicle.brands[0].name} {vehicle.models?.[0]?.name}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Daily:</span>
                        <span className="ml-2 font-medium">
                          {vehicle.price_per_day ? `$${vehicle.price_per_day}` : 'Not set'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Weekly:</span>
                        <span className="ml-2 font-medium">
                          {vehicle.price_per_week ? `$${vehicle.price_per_week}` : 'Not set'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Monthly:</span>
                        <span className="ml-2 font-medium">
                          {vehicle.price_per_month ? `$${vehicle.price_per_month}` : 'Not set'}
                        </span>
                      </div>
                    </div>

                    {/* Pricing recommendations */}
                    {!vehicle.price_per_day && (
                      <div className="mt-2">
                        <Badge variant="destructive" className="text-xs">
                          Pricing Required
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(vehicle)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Pricing
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pricing Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Pricing Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Competitive Pricing</h4>
              <p className="text-sm text-blue-700">
                Research similar vehicles in your area to set competitive rates. Consider vehicle age, features, and local demand.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Volume Discounts</h4>
              <p className="text-sm text-green-700">
                Offer 10-15% discounts for weekly rentals and 20-25% for monthly rentals to encourage longer bookings.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">Seasonal Pricing</h4>
              <p className="text-sm text-yellow-700">
                Consider adjusting prices based on seasonal demand, holidays, and local events that may affect rental needs.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Regular Reviews</h4>
              <p className="text-sm text-purple-700">
                Review and adjust your pricing monthly based on booking frequency, market changes, and customer feedback.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
