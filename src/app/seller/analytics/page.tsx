'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Truck,
  Star,
  Activity,
  Target
} from 'lucide-react'

interface Analytics {
  totalRevenue: number
  totalBookings: number
  totalVehicles: number
  averageRating: number
  occupancyRate: number
  revenueGrowth: number
  bookingGrowth: number
  monthlyRevenue: Array<{ month: string; revenue: number }>
  vehiclePerformance: Array<{ name: string; bookings: number; revenue: number }>
  bookingStatus: Array<{ status: string; count: number; color: string }>
}

export default function SellerAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('last-30-days')
  
  const { user } = useAuth()
  const supabase = createClient()

  const fetchAnalytics = useCallback(async () => {
    if (!user?.id) return

    setLoading(true)
    
    try {
      // Calculate date range
      const endDate = new Date()
      const startDate = new Date()
      
      switch (timeRange) {
        case 'last-7-days':
          startDate.setDate(endDate.getDate() - 7)
          break
        case 'last-30-days':
          startDate.setDate(endDate.getDate() - 30)
          break
        case 'last-90-days':
          startDate.setDate(endDate.getDate() - 90)
          break
        case 'last-year':
          startDate.setFullYear(endDate.getFullYear() - 1)
          break
      }

      // Fetch bookings data
      const { data: bookings } = await supabase
        .from('bookings')
        .select(`
          *,
          vehicles!inner(name, seller_id, price_per_day)
        `)
        .eq('vehicles.seller_id', user.id)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())

      // Fetch vehicles data
      const { data: vehicles } = await supabase
        .from('vehicles')
        .select('*')
        .eq('seller_id', user.id)

      // Calculate analytics
      const totalRevenue = bookings?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0
      const totalBookings = bookings?.length || 0
      const totalVehicles = vehicles?.length || 0

      // Calculate previous period for growth comparison
      const prevStartDate = new Date(startDate)
      const prevEndDate = new Date(startDate)
      const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      prevStartDate.setDate(prevStartDate.getDate() - daysDiff)

      const { data: prevBookings } = await supabase
        .from('bookings')
        .select(`
          *,
          vehicles!inner(seller_id)
        `)
        .eq('vehicles.seller_id', user.id)
        .gte('created_at', prevStartDate.toISOString())
        .lte('created_at', prevEndDate.toISOString())

      const prevRevenue = prevBookings?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0
      const prevBookingCount = prevBookings?.length || 0

      const revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0
      const bookingGrowth = prevBookingCount > 0 ? ((totalBookings - prevBookingCount) / prevBookingCount) * 100 : 0

      // Monthly revenue data
      const monthlyData: Record<string, number> = {}
      bookings?.forEach(booking => {
        if (!booking.created_at) return
        const month = new Date(booking.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        monthlyData[month] = (monthlyData[month] || 0) + (booking.total_amount || 0)
      })

      const monthlyRevenue = Object.entries(monthlyData).map(([month, revenue]) => ({
        month,
        revenue: revenue as number
      }))

      // Vehicle performance
      const vehicleData: Record<string, { bookings: number; revenue: number }> = {}
      bookings?.forEach(booking => {
        const vehicleName = booking.vehicles?.name || 'Unknown'
        if (!vehicleData[vehicleName]) {
          vehicleData[vehicleName] = { bookings: 0, revenue: 0 }
        }
        vehicleData[vehicleName].bookings += 1
        vehicleData[vehicleName].revenue += booking.total_amount || 0
      })

      const vehiclePerformance = Object.entries(vehicleData).map(([name, data]) => ({
        name,
        bookings: data.bookings,
        revenue: data.revenue
      }))

      // Booking status distribution
      const statusData: Record<string, number> = {}
      bookings?.forEach(booking => {
        statusData[booking.status] = (statusData[booking.status] || 0) + 1
      })

      const statusColors: Record<string, string> = {
        pending: '#f59e0b',
        confirmed: '#10b981',
        completed: '#3b82f6',
        cancelled: '#ef4444'
      }

      const bookingStatus = Object.entries(statusData).map(([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        count: count as number,
        color: statusColors[status] || '#6b7280'
      }))

      // Calculate average rating (placeholder - would need reviews table)
      const averageRating = 4.5 // Mock data

      // Calculate occupancy rate
      const totalDays = (vehicles?.length || 0) * daysDiff || 1
      const bookedDays = bookings?.reduce((sum, booking) => {
        const start = new Date(booking.start_date)
        const end = new Date(booking.end_date)
        return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      }, 0) || 0
      const occupancyRate = (bookedDays / totalDays) * 100

      setAnalytics({
        totalRevenue,
        totalBookings,
        totalVehicles,
        averageRating,
        occupancyRate,
        revenueGrowth,
        bookingGrowth,
        monthlyRevenue,
        vehiclePerformance,
        bookingStatus
      })

    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.id, timeRange, supabase])

  useEffect(() => {
    if (user?.id) {
      fetchAnalytics()
    }
  }, [user?.id, fetchAnalytics])

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your business performance and insights</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-7-days">Last 7 days</SelectItem>
            <SelectItem value="last-30-days">Last 30 days</SelectItem>
            <SelectItem value="last-90-days">Last 90 days</SelectItem>
            <SelectItem value="last-year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {analytics.revenueGrowth >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
              )}
              <span className={analytics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(analytics.revenueGrowth).toFixed(1)}% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalBookings}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {analytics.bookingGrowth >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
              )}
              <span className={analytics.bookingGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(analytics.bookingGrowth).toFixed(1)}% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fleet Size</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalVehicles}</div>
            <p className="text-xs text-muted-foreground">Active vehicles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.occupancyRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Fleet utilization</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Booking Status */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Status Distribution</CardTitle>
            <CardDescription>Current booking status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.bookingStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: { name?: string; percent?: number }) => 
                    `${props.name ?? ''} ${((props.percent ?? 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analytics.bookingStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Performance</CardTitle>
          <CardDescription>Revenue and booking count by vehicle</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={analytics.vehiclePerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" name="Revenue ($)" />
              <Bar yAxisId="right" dataKey="bookings" fill="#10b981" name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageRating.toFixed(1)}</div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(analytics.averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Revenue per Booking</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${analytics.totalBookings > 0 ? (analytics.totalRevenue / analytics.totalBookings).toFixed(0) : '0'}
            </div>
            <p className="text-xs text-muted-foreground">Per booking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue per Vehicle</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${analytics.totalVehicles > 0 ? (analytics.totalRevenue / analytics.totalVehicles).toFixed(0) : '0'}
            </div>
            <p className="text-xs text-muted-foreground">Per vehicle</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
