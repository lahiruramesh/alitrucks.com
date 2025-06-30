'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  MessageCircle, 
  Search, 
  Plus,
  Clock,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthContext } from '@/components/auth/AuthProvider'
import { cn } from '@/lib/utils'

interface Conversation {
  id: number
  user_id: string
  admin_id: string | null
  subject: string | null
  category: string
  priority: string
  status: string
  vehicle_id: number | null
  created_at: string
  updated_at: string
  last_message_at: string
  unread_count?: number
  last_message?: {
    content: string
    sender_id: string
    created_at: string
  }
  user_profile?: {
    full_name: string
    role: string
  }
}

interface ConversationListProps {
  userRole: 'seller' | 'buyer' | 'admin'
  selectedConversationId?: number
  onConversationSelect: (conversationId: number) => void
  onNewConversation: () => void
}

const categoryLabels = {
  vehicle_approval: 'Vehicle Approval',
  account_issues: 'Account Issues',
  policy_questions: 'Policy Questions',
  booking_help: 'Booking Help',
  payment_issues: 'Payment Issues',
  technical_support: 'Technical Support',
  general: 'General Support'
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  normal: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
}

const statusColors = {
  open: 'bg-green-100 text-green-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-blue-100 text-blue-800',
  closed: 'bg-gray-100 text-gray-800'
}

export default function ConversationList({ 
  userRole, 
  selectedConversationId, 
  onConversationSelect, 
  onNewConversation 
}: ConversationListProps) {
  const { user, initialized } = useAuthContext()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    // Only fetch conversations if user is authenticated and initialized
    if (!initialized || !user?.id) {
      setLoading(false)
      return
    }
    
    fetchConversations()
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('conversations-list')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'conversations' },
        () => {
          fetchConversations()
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'messages' },
        () => {
          fetchConversations()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user?.id, userRole, initialized]) // Add initialized as dependency

  useEffect(() => {
    filterConversations()
  }, [conversations, searchTerm, statusFilter])

  const fetchConversations = async () => {
    // Don't fetch if user is not authenticated or not initialized
    if (!initialized || !user?.id) {
      console.log('User not authenticated or not initialized, skipping conversation fetch')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      let query = supabase
        .from('conversations')
        .select(`
          *,
          user_profile:user_id (
            full_name,
            role
          )
        `)
        .order('last_message_at', { ascending: false })

      // Filter based on user role
      if (userRole === 'admin') {
        // Admins see all conversations
      } else {
        // Sellers and buyers see only their own conversations
        query = query.eq('user_id', user?.id)
      }

      const { data: conversationsData, error } = await query

      if (error) throw error

      // Fetch unread message counts and last messages
      const conversationsWithDetails = await Promise.all(
        (conversationsData || []).map(async (conv) => {
          // Get unread count
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('is_read', false)
            .neq('sender_id', user?.id)

          // Get last message
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('content, sender_id, created_at')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

          return {
            ...conv,
            unread_count: unreadCount || 0,
            last_message: lastMessage
          }
        })
      )

      setConversations(conversationsWithDetails)
    } catch (err: any) {
      console.error('Failed to load conversations:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const filterConversations = () => {
    let filtered = conversations

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(conv => 
        conv.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        categoryLabels[conv.category as keyof typeof categoryLabels]?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(conv => conv.status === statusFilter)
    }

    setFilteredConversations(filtered)
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  const truncateMessage = (message: string, maxLength: number = 50) => {
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Conversations
          </CardTitle>
          <Button size="sm" onClick={onNewConversation}>
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
        </div>
        
        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            {['all', 'open', 'in_progress', 'resolved', 'closed'].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className="text-xs"
              >
                {status === 'all' ? 'All' : status.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-0">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading conversations...</div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <MessageCircle className="w-12 h-12 text-gray-300 mb-3" />
            <h3 className="font-medium text-gray-900 mb-1">No conversations</h3>
            <p className="text-sm text-gray-500 mb-4">
              {searchTerm ? 'No conversations match your search.' : 'Start a new conversation with admin support.'}
            </p>
            <Button onClick={onNewConversation} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Start Conversation
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onConversationSelect(conversation.id)}
                className={cn(
                  'p-4 hover:bg-gray-50 cursor-pointer transition-colors',
                  selectedConversationId === conversation.id && 'bg-blue-50 border-r-2 border-blue-500'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">
                      {conversation.subject || 'No Subject'}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {categoryLabels[conversation.category as keyof typeof categoryLabels]}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    {conversation.unread_count && conversation.unread_count > 0 && (
                      <Badge className="bg-blue-600 text-white text-xs px-1.5 py-0.5">
                        {conversation.unread_count}
                      </Badge>
                    )}
                    <Badge className={cn('text-xs', priorityColors[conversation.priority as keyof typeof priorityColors])}>
                      {conversation.priority}
                    </Badge>
                  </div>
                </div>
                
                {conversation.last_message && (
                  <p className="text-xs text-gray-600 mb-2">
                    {conversation.last_message.sender_id === user?.id ? 'You: ' : 'Admin: '}
                    {truncateMessage(conversation.last_message.content)}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <Badge className={cn('text-xs', statusColors[conversation.status as keyof typeof statusColors])}>
                    {conversation.status.replace('_', ' ')}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(conversation.last_message_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
