'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Eye, Download } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Database } from '@/types/database'

type Vehicle = Database['public']['Tables']['vehicles']['Row']

interface VehicleActionsProps {
  vehicle: Vehicle
}

export function VehicleActions({ vehicle }: VehicleActionsProps) {
  const router = useRouter()

  const handleEdit = () => {
    router.push(`/seller/vehicles/${vehicle.id}/edit`)
  }

  const handleViewPublic = () => {
    router.push(`/truck/${vehicle.id}`)
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
      // TODO: Implement delete functionality
      console.log('Delete vehicle:', vehicle.id)
    }
  }

  const handleDownloadReport = () => {
    // TODO: Implement report download
    console.log('Download report for vehicle:', vehicle.id)
  }

  return (
    <div className="space-y-4">
      {/* Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            onClick={handleEdit}
            className="w-full justify-start"
            variant="outline"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Vehicle
          </Button>

          {vehicle.status === 'approved' && (
            <Button 
              onClick={handleViewPublic}
              className="w-full justify-start"
              variant="outline"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Public Page
            </Button>
          )}

          <Button 
            onClick={handleDownloadReport}
            className="w-full justify-start"
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>

          <Button 
            onClick={handleDelete}
            className="w-full justify-start"
            variant="outline"
            disabled={vehicle.status === 'active'}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Vehicle
          </Button>
        </CardContent>
      </Card>

      {/* Status Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <span className="text-sm font-medium">Current Status:</span>
            <div className="mt-1">
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                vehicle.status === 'approved' 
                  ? 'bg-green-100 text-green-800'
                  : vehicle.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
              </span>
            </div>
          </div>

          {vehicle.created_at && (
            <div>
              <span className="text-sm font-medium">Created:</span>
              <p className="text-sm text-gray-600">
                {new Date(vehicle.created_at).toLocaleDateString()}
              </p>
            </div>
          )}

          {vehicle.updated_at && (
            <div>
              <span className="text-sm font-medium">Last Updated:</span>
              <p className="text-sm text-gray-600">
                {new Date(vehicle.updated_at).toLocaleDateString()}
              </p>
            </div>
          )}

          {vehicle.status === 'approved' && vehicle.approved_at && (
            <div>
              <span className="text-sm font-medium">Approved:</span>
              <p className="text-sm text-gray-600">
                {new Date(vehicle.approved_at).toLocaleDateString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Views:</span>
            <span className="text-sm font-medium">0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Bookings:</span>
            <span className="text-sm font-medium">0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Revenue:</span>
            <span className="text-sm font-medium">$0</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
