'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Leaf, TreePine, Car, Calculator } from 'lucide-react'

interface CarbonCalculatorProps {
  estimatedMiles: number
  onMilesChange: (miles: number) => void
  fuelType: string
  startDate: string
  endDate: string
}

interface CarbonData {
  totalCO2Saved: number
  dieselEmissions: number
  electricEmissions: number
  treesEquivalent: number
  carDaysEquivalent: number
  costSavings: number
}

export default function CarbonCalculator({ 
  estimatedMiles, 
  onMilesChange, 
  fuelType, 
  startDate, 
  endDate 
}: CarbonCalculatorProps) {
  const [carbonData, setCarbonData] = useState<CarbonData>({
    totalCO2Saved: 0,
    dieselEmissions: 0,
    electricEmissions: 0,
    treesEquivalent: 0,
    carDaysEquivalent: 0,
    costSavings: 0
  })

  const calculateCarbonImpact = useCallback(() => {
    // CO2 emission factors (kg CO2 per mile)
    const dieselTruckEmission = 2.68 // kg CO2 per mile for commercial diesel truck
    const electricTruckEmission = 0.4 // kg CO2 per mile (considering electricity grid mix)
    const hybridReduction = 0.45 // 45% reduction for hybrid

    // Calculate total miles based on date range and estimated daily miles
    let totalMiles = estimatedMiles
    if (startDate && endDate) {
      const days = Math.ceil(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
      )
      totalMiles = estimatedMiles * Math.max(1, days)
    }

    // Calculate emissions for different fuel types
    const dieselEmissions = totalMiles * dieselTruckEmission
    let actualEmissions = dieselEmissions

    switch (fuelType) {
      case 'electric':
        actualEmissions = totalMiles * electricTruckEmission
        break
      case 'hybrid':
        actualEmissions = dieselEmissions * (1 - hybridReduction)
        break
      default:
        actualEmissions = dieselEmissions
    }

    const co2Saved = Math.max(0, dieselEmissions - actualEmissions)
    
    // Calculate equivalents
    const treesEquivalent = Math.round(co2Saved / 22) // Average tree absorbs 22kg CO2/year
    const carDaysEquivalent = Math.round(co2Saved / 4.6) // Average car emits 4.6kg CO2/day
    
    // Calculate fuel cost savings (rough estimate)
    const dieselCostPerMile = 0.15 // $0.15 per mile
    const electricCostPerMile = 0.04 // $0.04 per mile
    const costSavings = fuelType === 'electric' 
      ? totalMiles * (dieselCostPerMile - electricCostPerMile)
      : fuelType === 'hybrid'
        ? totalMiles * dieselCostPerMile * 0.3
        : 0

    setCarbonData({
      totalCO2Saved: co2Saved,
      dieselEmissions,
      electricEmissions: actualEmissions,
      treesEquivalent,
      carDaysEquivalent,
      costSavings
    })
  }, [estimatedMiles, fuelType, startDate, endDate])

  useEffect(() => {
    calculateCarbonImpact()
  }, [estimatedMiles, fuelType, startDate, endDate, calculateCarbonImpact])

  const getSavingsColor = (savings: number) => {
    if (savings >= 100) return 'text-green-700'
    if (savings >= 50) return 'text-green-600'
    if (savings >= 20) return 'text-green-500'
    return 'text-emerald-500'
  }

  const getFuelTypeLabel = (type: string) => {
    switch (type) {
      case 'electric': return { label: 'Electric', color: 'bg-green-100 text-green-800', icon: '⚡' }
      case 'hybrid': return { label: 'Hybrid', color: 'bg-blue-100 text-blue-800', icon: '🔋' }
      case 'diesel': return { label: 'Diesel', color: 'bg-gray-100 text-gray-800', icon: '⛽' }
      default: return { label: 'Any', color: 'bg-gray-100 text-gray-600', icon: '🚛' }
    }
  }

  const fuelInfo = getFuelTypeLabel(fuelType)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="w-5 h-5 mr-2 text-green-600" />
          Environmental Impact Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Estimated Miles per Day: {estimatedMiles}</Label>
            <div className="px-2">
              <Slider
                value={[estimatedMiles]}
                onValueChange={([value]) => onMilesChange(value)}
                max={500}
                min={10}
                step={10}
                className="w-full"
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Adjust based on your expected daily usage
            </div>
          </div>

          <div className="space-y-2">
            <Label>Selected Fuel Type</Label>
            <div className="flex items-center">
              <Badge className={fuelInfo.color}>
                {fuelInfo.icon} {fuelInfo.label}
              </Badge>
              {!fuelType && (
                <span className="text-sm text-muted-foreground ml-2">
                  Select a fuel type to see specific savings
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Carbon Impact Display */}
        {carbonData.totalCO2Saved > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <div className={`text-2xl font-bold ${getSavingsColor(carbonData.totalCO2Saved)}`}>
                {carbonData.totalCO2Saved.toFixed(1)} kg
              </div>
              <div className="text-sm text-muted-foreground">CO₂ Saved</div>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <TreePine className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {carbonData.treesEquivalent}
              </div>
              <div className="text-sm text-muted-foreground">Trees Equivalent</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Car className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {carbonData.carDaysEquivalent}
              </div>
              <div className="text-sm text-muted-foreground">Car Days Off Road</div>
            </div>
          </div>
        )}

        {/* Cost Savings */}
        {carbonData.costSavings > 0 && (
          <div className="p-4 bg-amber-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-amber-800">Estimated Fuel Savings</h4>
                <p className="text-sm text-amber-700">
                  Based on current fuel prices vs electricity costs
                </p>
              </div>
              <div className="text-2xl font-bold text-amber-600">
                ${carbonData.costSavings.toFixed(0)}
              </div>
            </div>
          </div>
        )}

        {/* Comparison Chart */}
        <div className="space-y-3">
          <Label>Emission Comparison</Label>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                Diesel Truck
              </span>
              <span>{carbonData.dieselEmissions.toFixed(1)} kg CO₂</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ width: '100%' }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                {fuelInfo.label} Truck
              </span>
              <span>{carbonData.electricEmissions.toFixed(1)} kg CO₂</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ 
                  width: `${Math.max(10, (carbonData.electricEmissions / carbonData.dieselEmissions) * 100)}%` 
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Environmental Message */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-l-4 border-green-500">
          <h4 className="font-semibold text-green-800 mb-2">Make a Difference</h4>
          <p className="text-sm text-green-700">
            {carbonData.totalCO2Saved > 100 
              ? "Excellent choice! You're making a significant positive impact on the environment."
              : carbonData.totalCO2Saved > 50
                ? "Great job! Every kilogram of CO₂ saved helps fight climate change."
                : "Even small actions matter. Choose electric trucks to maximize your positive impact."
            }
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
