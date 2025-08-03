import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'

export interface AdminNotification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  data?: Record<string, unknown>
  read: boolean
  created_at: string
}

export function useAdminNotifications() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([])

  const createNotification = useCallback(async (
    type: string,
    title: string,
    message: string,
    data?: Record<string, unknown>
  ) => {
    try {
      const supabase = createClient()
      
      // Get all admin users
      const { data: admins, error: adminError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('role', 'admin')

      if (adminError) {
        throw adminError
      }

      // Create notifications for all admins
      const notifications = admins.map((admin: { id: string }) => ({
        user_id: admin.id,
        type,
        title,
        message,
        data: data || null,
        read: false
      }))

      const { error: insertError } = await supabase
        .from('admin_notifications')
        .insert(notifications as never)

      if (insertError) {
        throw insertError
      }

      return { success: true }
    } catch (error) {
      console.error('Error creating notification:', error)
      return { success: false, error }
    }
  }, [])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('admin_notifications')
        .update({ read: true })
        .eq('id', notificationId)

      if (error) {
        throw error
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }, [])

  const getUnreadCount = useCallback(async (userId: string) => {
    try {
      const supabase = createClient()
      const { count, error } = await supabase
        .from('admin_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false)

      if (error) {
        throw error
      }

      return count || 0
    } catch (error) {
      console.error('Error getting unread count:', error)
      return 0
    }
  }, [])

  return {
    notifications,
    createNotification,
    markAsRead,
    getUnreadCount
  }
}
