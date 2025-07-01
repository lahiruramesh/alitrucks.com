'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';



export function useAdminUnreadMessages(enabled: boolean = true) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setUnreadCount(0);
      return;
    }
    const fetchUnreadCount = async () => {
      const startTime = performance.now();
      try {
        // Simple and fast approach - just check if we have any support conversations
        const { count, error } = await supabase
          .from('conversations')
          .select('id', { count: 'exact', head: true })
          .eq('type', 'support')
          .eq('status', 'open');

        if (error) {
          console.error('Error fetching admin unread count:', error);
          setUnreadCount(0);
          return;
        }

        // For now, just set count to number of open conversations
        // This is much faster than complex queries
        setUnreadCount(count || 0);
        
        const endTime = performance.now();
        console.log(`Admin unread count fetch took ${endTime - startTime}ms`);
      } catch (error) {
        console.error('Error in useAdminUnreadMessages:', error);
        setUnreadCount(0);
      }
    };

    fetchUnreadCount();

    // Minimal real-time subscription 
    const messagesChannel = supabase
      .channel('admin_unread_simple')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversations',
          filter: 'type=eq.support',
        },
        () => {
          setTimeout(fetchUnreadCount, 1000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [enabled]);

  return { unreadCount };
}
