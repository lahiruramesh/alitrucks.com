import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Plus } from 'lucide-react'

export default function SellerAvailabilityPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Availability Management</h1>
          <p className="text-gray-600 mt-1">Manage when your vehicles are available for rent</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Block Dates
        </Button>
      </div>

      {/* Coming Soon */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Calendar Management
          </CardTitle>
          <CardDescription>
            Set availability windows and block out maintenance periods
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
          <p className="text-gray-500 mb-4">
            Calendar-based availability management is under development.
          </p>
          <p className="text-sm text-gray-400">
            For now, availability is managed through booking requests.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
