'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  MessageCircle, 
  Users,
  Clock,
  AlertTriangle
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import ConversationList from '@/components/chat/ConversationList'
import ChatInterface from '@/components/chat/ChatInterface'

interface ConversationStats {
  total: number
  open: number
  in_progress: number
  urgent: number
  unassigned: number
}

export default function AdminSupportPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<number | undefined>()
  const [showNewConversation, setShowNewConversation] = useState(false)
  const [stats, setStats] = useState<ConversationStats>({
    total: 0,
    open: 0,
    in_progress: 0,
    urgent: 0,
    unassigned: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Get conversation statistics
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('status, priority, admin_id')

      if (error) throw error

      const stats = {
        total: conversations?.length || 0,
        open: conversations?.filter(c => c.status === 'open').length || 0,
        in_progress: conversations?.filter(c => c.status === 'in_progress').length || 0,
        urgent: conversations?.filter(c => c.priority === 'urgent').length || 0,
        unassigned: conversations?.filter(c => !c.admin_id).length || 0
      }

      setStats(stats)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      console.error('Failed to load stats:', errorMessage)
    }
  }

  const handleConversationSelect = (conversationId: number) => {
    setSelectedConversationId(conversationId)
    setShowNewConversation(false)
  }

  const handleNewConversation = () => {
    setSelectedConversationId(undefined)
    setShowNewConversation(true)
  }

  const handleConversationCreated = (conversation: { id: number }) => {
    setSelectedConversationId(conversation.id)
    setShowNewConversation(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Support Management</h1>
        <p className="text-gray-600 mt-1">Manage user conversations and provide support</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <AlertTriangle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.open}</div>
            <p className="text-xs text-muted-foreground">
              Needs attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.in_progress}</div>
            <p className="text-xs text-muted-foreground">
              Being handled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
            <p className="text-xs text-muted-foreground">
              High priority
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.unassigned}</div>
            <p className="text-xs text-muted-foreground">
              No admin assigned
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConversationList
          selectedConversationId={selectedConversationId}
          onConversationSelect={handleConversationSelect}
          onNewConversation={handleNewConversation}
        />
        
        <ChatInterface
          conversationId={showNewConversation ? undefined : selectedConversationId}
          userRole="admin"
          onConversationCreated={handleConversationCreated}
        />
      </div>
    </div>
  )
}
