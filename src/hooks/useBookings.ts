'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { Booking } from '@/types/database'

interface UseBookingsOptions {
  role?: 'buyer' | 'seller' | 'all'
  status?: string
  autoRefresh?: boolean
}

interface UseBookingsReturn {
  bookings: Booking[]
  loading: boolean
  error: string | null
  createBooking: (bookingData: any) => Promise<Booking | null>
  updateBooking: (id: string, updates: any) => Promise<Booking | null>
  refreshBookings: () => Promise<void>
}

export function useBookings(options: UseBookingsOptions = {}): UseBookingsReturn {
  const { role = 'all', status, autoRefresh = true } = options
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchBookings = async () => {
    if (!user) {
      setBookings([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (role !== 'all') params.append('role', role)
      if (status) params.append('status', status)

      const response = await fetch(`/api/bookings?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings')
      }

      const data = await response.json()
      setBookings(data.bookings || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings')
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const createBooking = async (bookingData: any): Promise<Booking | null> => {
    try {
      setError(null)
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create booking')
      }

      const data = await response.json()
      const newBooking = data.booking

      setBookings(prev => [newBooking, ...prev])
      return newBooking
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking')
      return null
    }
  }

  const updateBooking = async (id: string, updates: any): Promise<Booking | null> => {
    try {
      setError(null)

      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update booking')
      }

      const data = await response.json()
      const updatedBooking = data.booking

      setBookings(prev => 
        prev.map(booking => 
          booking.id === id ? updatedBooking : booking
        )
      )

      return updatedBooking
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update booking')
      return null
    }
  }

  const refreshBookings = async () => {
    await fetchBookings()
  }

  useEffect(() => {
    if (autoRefresh) {
      fetchBookings()
    }
  }, [user, role, status, autoRefresh])

  return {
    bookings,
    loading,
    error,
    createBooking,
    updateBooking,
    refreshBookings,
  }
}
