import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DollarSign, TrendingUp } from 'lucide-react'

export default function SellerPricingPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pricing Management</h1>
          <p className="text-gray-600 mt-1">Set competitive rates and manage pricing strategies</p>
        </div>
        <Button>
          <TrendingUp className="w-4 h-4 mr-2" />
          Pricing Analytics
        </Button>
      </div>

      {/* Coming Soon */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Dynamic Pricing
          </CardTitle>
          <CardDescription>
            Advanced pricing tools and market insights
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
          <p className="text-gray-500 mb-4">
            Advanced pricing management features are under development.
          </p>
          <p className="text-sm text-gray-400">
            For now, pricing is managed when creating or editing vehicles.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
