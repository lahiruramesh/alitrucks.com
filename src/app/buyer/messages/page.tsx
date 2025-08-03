'use client'

import { useState } from 'react'
import ConversationList from '@/components/chat/ConversationList'
import ChatInterface from '@/components/chat/ChatInterface'

export default function BuyerMessagesPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<number | undefined>()
  const [showNewConversation, setShowNewConversation] = useState(false)

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
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-1">Get help with bookings, payments, and platform support</p>
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
          userRole="buyer"
          onConversationCreated={handleConversationCreated}
        />
      </div>
    </div>
  )
}
