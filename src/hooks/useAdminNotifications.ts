import { useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface AdminNotification {
  id: string
  type: 'vehicle_submitted' | 'vehicle_approved' | 'vehicle_rejected' | 'new_user'
  title: string
  message: string
  data?: any
  read: boolean
  created_at: string
}

export function useAdminNotifications() {
  const createNotification = useCallback(async (
    type: AdminNotification['type'],
    title: string,
    message: string,
    data?: any
  ) => {
    try {
      // Get all admin users
      const { data: admins, error: adminError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('role', 'admin')

      if (adminError) {
        console.error('Error fetching admins:', adminError)
        return
      }

      // Create notifications for all admins
      const notifications = admins.map(admin => ({
        user_id: admin.id,
        type,
        title,
        message,
        data,
        read: false
      }))

      const { error: insertError } = await supabase
        .from('admin_notifications')
        .insert(notifications)

      if (insertError) {
        console.error('Error creating notifications:', insertError)
      }
    } catch (error) {
      console.error('Error in createNotification:', error)
    }
  }, [])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('admin_notifications')
        .update({ read: true })
        .eq('id', notificationId)

      if (error) {
        console.error('Error marking notification as read:', error)
      }
    } catch (error) {
      console.error('Error in markAsRead:', error)
    }
  }, [])

  const getUnreadCount = useCallback(async (userId: string) => {
    try {
      const { count, error } = await supabase
        .from('admin_notifications')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .eq('read', false)

      if (error) {
        console.error('Error getting unread count:', error)
        return 0
      }

      return count || 0
    } catch (error) {
      console.error('Error in getUnreadCount:', error)
      return 0
    }
  }, [])

  return {
    createNotification,
    markAsRead,
    getUnreadCount
  }
}
