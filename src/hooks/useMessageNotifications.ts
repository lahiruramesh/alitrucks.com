'use client'

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { useNotifications } from '@/components/notifications/NotificationProvider';

export function useMessageNotifications() {
  const { user } = useAuthContext();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!user) return;

    const supabase = createClient()

    // Subscribe to new messages where the user is not the sender
    const messagesChannel = supabase
      .channel('message_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=neq.${user.id}`,
        },
        async (payload: { new: Record<string, unknown> }) => {
          const newMessage = payload.new as { 
            conversation_id: number; 
            sender_id: string; 
            content: string;
          };
          
          // Get conversation details to show more context
          const { data: conversation } = await supabase
            .from('conversations')
            .select('subject, category')
            .eq('id', newMessage.conversation_id)
            .single();

          // Get sender profile for display name
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('full_name, role')
            .eq('id', newMessage.sender_id)
            .single();

          const senderName = profile?.full_name || profile?.role || 'Someone';
          const subject = conversation?.subject || 'Support Chat';

          addNotification({
            type: 'message',
            title: `New message from ${senderName}`,
            message: `${subject}: ${newMessage.content.substring(0, 100)}${newMessage.content.length > 100 ? '...' : ''}`,
            duration: 6000,
            action: {
              label: 'View',
              onClick: () => {
                // Navigate to messages page based on user role
                const currentPath = window.location.pathname;
                if (currentPath.includes('/admin')) {
                  window.location.href = '/admin/support';
                } else if (currentPath.includes('/seller')) {
                  window.location.href = '/seller/messages';
                } else if (currentPath.includes('/buyer')) {
                  window.location.href = '/buyer/messages';
                }
              }
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [user, addNotification]);
}
