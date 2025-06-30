'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthContext } from '@/components/auth/AuthProvider'

interface UseUnreadMessages {
  unreadCount: number
  loading: boolean
  refresh: () => void
}

export function useUnreadMessages(): UseUnreadMessages {
  const { user, initialized } = useAuthContext()
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchUnreadCount = async () => {
    if (!initialized || !user) {
      setUnreadCount(0)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      // Simplified query for better performance
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)
        .neq('sender_id', user.id)

      if (error) {
        console.error('Error fetching unread count:', error)
        setUnreadCount(0)
        return
      }

      setUnreadCount(count || 0)
    } catch (err: any) {
      console.error('Failed to load unread count:', err.message)
      setUnreadCount(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!initialized) {
      return
    }
    
    fetchUnreadCount()

    // Optimized real-time subscription
    const subscription = supabase
      .channel('unread-messages-optimized')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `sender_id=neq.${user?.id}` 
        },
        () => {
          setTimeout(fetchUnreadCount, 1000) // Debounce
        }
      )
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'messages',
          filter: 'is_read=eq.true'
        },
        () => {
          setTimeout(fetchUnreadCount, 1000) // Debounce
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user, initialized])

  return {
    unreadCount,
    loading,
    refresh: fetchUnreadCount
  }
}
