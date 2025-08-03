'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useBookings } from '@/hooks/useBookings'
import { formatDate } from '@/lib/utils'
import { Leaf, TreePine, Globe, TrendingUp, Award, Calendar } from 'lucide-react'

interface CarbonCalculation {
  totalCO2Saved: number
  equivalentTrees: number
  milesEquivalent: number
  trips: {
    id: string
    startDate: string
    endDate: string
    co2Saved: number
    distanceMiles: number
    vehicleType: string
  }[]
}

export default function BuyerCarbonSavings() {
  const { bookings } = useBookings({ role: 'buyer', status: 'completed' })
  const [carbonData, setCarbonData] = useState<CarbonCalculation>({
    totalCO2Saved: 0,
    equivalentTrees: 0,
    milesEquivalent: 0,
    trips: []
  })

  useEffect(() => {
    // Calculate carbon savings for all completed bookings
    const trips = bookings.map(booking => {
      const days = booking.end_date && booking.start_date 
        ? Math.ceil((new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / (1000 * 60 * 60 * 24))
        : 1
      
      // Estimate based on vehicle type and usage
      // Electric truck: 2.5 kg CO2 saved per day vs diesel
      // Average commercial truck: 150-200 miles per day
      const dailyMiles = 175
      const co2SavedPerMile = 2.68 // kg CO2 per mile for commercial diesel truck
      const co2Saved = days * dailyMiles * co2SavedPerMile * 0.85 // 85% savings with electric
      const distanceMiles = days * dailyMiles

      return {
        id: booking.id,
        startDate: booking.start_date || '',
        endDate: booking.end_date || '',
        co2Saved,
        distanceMiles,
        vehicleType: 'Electric Truck'
      }
    })

    const totalCO2Saved = trips.reduce((sum, trip) => sum + trip.co2Saved, 0)
    const equivalentTrees = Math.round(totalCO2Saved / 22) // Average tree absorbs 22kg CO2/year
    const milesEquivalent = trips.reduce((sum, trip) => sum + trip.distanceMiles, 0)

    setCarbonData({
      totalCO2Saved,
      equivalentTrees,
      milesEquivalent,
      trips
    })
  }, [bookings])

  const getEcoScore = (co2Saved: number): { score: string; color: string; description: string } => {
    if (co2Saved >= 1000) return { score: 'Eco Champion', color: 'text-green-700', description: 'Outstanding environmental impact!' }
    if (co2Saved >= 500) return { score: 'Green Leader', color: 'text-green-600', description: 'Excellent contribution to sustainability' }
    if (co2Saved >= 200) return { score: 'Eco Warrior', color: 'text-green-500', description: 'Great job reducing emissions' }
    if (co2Saved >= 50) return { score: 'Green Starter', color: 'text-emerald-500', description: 'Good start on your eco journey' }
    return { score: 'New to Green', color: 'text-slate-500', description: 'Every journey begins with a single step' }
  }

  const ecoScore = getEcoScore(carbonData.totalCO2Saved)

  return (
    <div className="space-y-6">
      {/* Environmental Impact Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="text-center pb-2">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">CO₂ Emissions Saved</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {carbonData.totalCO2Saved.toFixed(1)} kg
            </div>
            <p className="text-sm text-muted-foreground">
              Equivalent to taking a car off the road for {Math.round(carbonData.totalCO2Saved / 4.6)} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center pb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <TreePine className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Trees Equivalent</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {carbonData.equivalentTrees}
            </div>
            <p className="text-sm text-muted-foreground">
              Trees needed to absorb the same CO₂ in one year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center pb-2">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Globe className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Distance Covered</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {carbonData.milesEquivalent.toLocaleString()} mi
            </div>
            <p className="text-sm text-muted-foreground">
              Total eco-friendly miles driven
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Eco Score Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-500" />
            Your Eco Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <Badge variant="outline" className={`${ecoScore.color} border-current`}>
                {ecoScore.score}
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">{ecoScore.description}</p>
            </div>
            <div className="text-right">
              <TrendingUp className="w-8 h-8 text-green-500 ml-auto" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to next level</span>
              <span>{carbonData.totalCO2Saved >= 1000 ? 'Max Level!' : `${Math.round((carbonData.totalCO2Saved % 500) / 5)}%`}</span>
            </div>
            <Progress 
              value={carbonData.totalCO2Saved >= 1000 ? 100 : (carbonData.totalCO2Saved % 500) / 5} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Trip History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Trip Carbon Savings History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {carbonData.trips.length === 0 ? (
            <div className="text-center py-8">
              <Leaf className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No completed trips yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Start renting electric trucks to see your environmental impact!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {carbonData.trips.map((trip, index) => (
                <div key={trip.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        {trip.vehicleType}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Trip #{index + 1}
                      </span>
                    </div>
                    <p className="text-sm">
                      {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {trip.distanceMiles.toLocaleString()} miles
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {trip.co2Saved.toFixed(1)} kg
                    </div>
                    <p className="text-xs text-muted-foreground">CO₂ saved</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Environmental Facts */}
      <Card>
        <CardHeader>
          <CardTitle>Did You Know?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Electric vs Diesel</h4>
              <p className="text-sm text-green-700">
                Electric trucks produce 85% fewer emissions than diesel trucks, 
                helping reduce urban air pollution and greenhouse gases.
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Climate Impact</h4>
              <p className="text-sm text-blue-700">
                Transportation accounts for 29% of greenhouse gas emissions. 
                Choosing electric trucks makes a real difference!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
