'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Send, 
  Paperclip, 
  X,
  MessageCircle,
  Clock,
  CheckCircle2,
  Plus
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthContext } from '@/components/auth/AuthProvider'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { FileUpload } from './FileUpload'
import { MessageActions } from './MessageActions'

interface FileAttachment {
  file: File;
  url: string;
  id: string;
}

interface Message {
  id: number
  conversation_id: number
  sender_id: string
  content: string
  message_type: string
  is_read: boolean
  read_at: string | null
  attachment_url: string | null
  attachment_name: string | null
  created_at: string
  sender_profile?: {
    full_name: string
    role: string
  }
}

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
}

interface ChatInterfaceProps {
  conversationId?: number
  userRole: 'seller' | 'buyer' | 'admin'
  onConversationCreated?: (conversation: Conversation) => void
}

const categoryOptions = {
  seller: [
    { value: 'vehicle_approval', label: 'Vehicle Approval' },
    { value: 'account_issues', label: 'Account Issues' },
    { value: 'policy_questions', label: 'Policy Questions' },
    { value: 'general', label: 'General Support' }
  ],
  buyer: [
    { value: 'booking_help', label: 'Booking Help' },
    { value: 'payment_issues', label: 'Payment Issues' },
    { value: 'technical_support', label: 'Technical Support' },
    { value: 'general', label: 'General Support' }
  ],
  admin: [
    { value: 'vehicle_approval', label: 'Vehicle Approval' },
    { value: 'account_issues', label: 'Account Issues' },
    { value: 'policy_questions', label: 'Policy Questions' },
    { value: 'booking_help', label: 'Booking Help' },
    { value: 'payment_issues', label: 'Payment Issues' },
    { value: 'technical_support', label: 'Technical Support' },
    { value: 'general', label: 'General Support' }
  ]
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

export default function ChatInterface({ conversationId, userRole, onConversationCreated }: ChatInterfaceProps) {
  const { user } = useAuthContext()
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showNewConversation, setShowNewConversation] = useState(!conversationId)
  const [attachments, setAttachments] = useState<FileAttachment[]>([])
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  
  // New conversation form
  const [newConversationData, setNewConversationData] = useState({
    subject: '',
    category: '',
    priority: 'normal',
    initialMessage: ''
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Set up scroll behavior
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchConversation = useCallback(async () => {
    if (!conversationId) return

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single()

      if (error) throw error
      setConversation(data)
    } catch (err: unknown) {
      setError('Failed to load conversation: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }, [conversationId])

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender_profile:sender_id (
            full_name,
            role
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])

      // Mark messages as read
      if (data && data.length > 0) {
        const unreadMessages = data.filter(msg => !msg.is_read && msg.sender_id !== user?.id)
        if (unreadMessages.length > 0) {
          await supabase
            .from('messages')
            .update({ is_read: true, read_at: new Date().toISOString() })
            .in('id', unreadMessages.map(msg => msg.id))
        }
      }
    } catch (err: unknown) {
      setError('Failed to load messages: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }, [conversationId, user?.id])

  useEffect(() => {
    if (conversationId) {
      fetchConversation()
      fetchMessages()
    }
  }, [conversationId, fetchConversation, fetchMessages])

  // Set up real-time subscription
  useEffect(() => {
    if (conversationId) {
      const subscription = supabase
        .channel(`conversation-${conversationId}`)
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
          () => {
            fetchMessages()
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [conversationId, fetchMessages])

  const createConversation = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!newConversationData.subject || !newConversationData.category || !newConversationData.initialMessage) {
        throw new Error('Please fill in all required fields')
      }

      // Create conversation
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          user_id: user?.id,
          subject: newConversationData.subject,
          category: newConversationData.category,
          priority: newConversationData.priority,
          status: 'open'
        })
        .select()
        .single()

      if (conversationError) throw conversationError

      // Send initial message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          sender_id: user?.id,
          content: newConversationData.initialMessage,
          message_type: 'text'
        })

      if (messageError) throw messageError

      setShowNewConversation(false)
      onConversationCreated?.(conversation)
      
      // Reset form
      setNewConversationData({
        subject: '',
        category: '',
        priority: 'normal',
        initialMessage: ''
      })

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if ((!newMessage.trim() && attachments.length === 0) || !conversationId) return

    try {
      setLoading(true)
      setError(null)

      let attachmentUrl = null
      let attachmentName = null

      // Upload files if there are any
      if (attachments.length > 0) {
        try {
          const uploadedFiles = await uploadFiles(attachments)
          // For now, just use the first file. In a full implementation, 
          // you might want to support multiple files per message
          if (uploadedFiles.length > 0) {
            attachmentUrl = uploadedFiles[0].url
            attachmentName = uploadedFiles[0].name
          }
        } catch (uploadError) {
          console.error('File upload failed:', uploadError)
          setError('Failed to upload files. Message will be sent without attachments.')
        }
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user?.id,
          content: newMessage.trim() || 'File attachment',
          message_type: attachmentUrl ? 'file' : 'text',
          attachment_url: attachmentUrl,
          attachment_name: attachmentName
        })

      if (error) throw error

      setNewMessage('')
      setAttachments([])
      handleTypingStop()
      fetchMessages()

    } catch (err: unknown) {
      setError('Failed to send message: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const uploadFiles = async (files: FileAttachment[]) => {
    const uploadPromises = files.map(async (attachment) => {
      const fileExt = attachment.file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      
      const { error } = await supabase.storage
        .from('chat-attachments')
        .upload(fileName, attachment.file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('chat-attachments')
        .getPublicUrl(fileName)

      return {
        url: publicUrl,
        name: attachment.file.name
      }
    })

    return Promise.all(uploadPromises)
  }

  // Typing indicator functions
  const handleTypingStart = () => {
    // TODO: Send typing status to other users via real-time channel
  }

  const handleTypingStop = () => {
    // TODO: Send typing status to other users via real-time channel
  }

  // File attachment handlers
  const handleFileSelect = (newAttachments: FileAttachment[]) => {
    setAttachments(newAttachments)
  }

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id))
  }

  // Message actions
  const handleReply = (content: string) => {
    setReplyingTo(content.substring(0, 100))
    setNewMessage(`Replying to: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"\n\n`)
  }

  const handleDeleteMessage = async (messageId: number) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)
        .eq('sender_id', user?.id) // Only allow deleting own messages

      if (error) throw error
      fetchMessages()
    } catch (error) {
      console.error('Failed to delete message:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (showNewConversation) {
        createConversation()
      } else {
        sendMessage()
      }
    }
  }

  if (showNewConversation) {
    return (
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Start New Conversation
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 space-y-4">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={newConversationData.subject}
                onChange={(e) => setNewConversationData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Brief description of your issue..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(value) => setNewConversationData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions[userRole].map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={newConversationData.priority}
                  onValueChange={(value) => setNewConversationData(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="initialMessage">Message *</Label>
              <Textarea
                id="initialMessage"
                value={newConversationData.initialMessage}
                onChange={(e) => setNewConversationData(prev => ({ ...prev, initialMessage: e.target.value }))}
                placeholder="Describe your issue or question in detail..."
                rows={6}
                onKeyPress={handleKeyPress}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowNewConversation(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={createConversation} disabled={loading}>
              {loading ? 'Creating...' : 'Start Conversation'}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!conversationId || !conversation) {
    return (
      <Card className="h-[600px] flex flex-col items-center justify-center">
        <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Conversation Selected</h3>
        <p className="text-gray-500 mb-4">Select a conversation or start a new one</p>
        <Button onClick={() => setShowNewConversation(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Start New Conversation
        </Button>
      </Card>
    )
  }

  return (
    <Card className="h-[600px] flex flex-col">
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{conversation.subject}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={priorityColors[conversation.priority as keyof typeof priorityColors]}>
                {conversation.priority}
              </Badge>
              <Badge className={statusColors[conversation.status as keyof typeof statusColors]}>
                {conversation.status}
              </Badge>
              <span className="text-sm text-gray-500">
                {categoryOptions[userRole].find(c => c.value === conversation.category)?.label}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto space-y-4 p-4">
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {messages.map((message) => {
          const isOwnMessage = message.sender_id === user?.id
          return (
            <div
              key={message.id}
              className={cn(
                'flex group',
                isOwnMessage ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[70%] sm:max-w-[80%] rounded-lg px-3 py-2 relative',
                  isOwnMessage
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                )}
              >
                {!isOwnMessage && (
                  <div className="text-xs font-medium mb-1 opacity-70">
                    Admin Support
                  </div>
                )}
                
                {/* Message Content */}
                <div className="whitespace-pre-wrap">{message.content}</div>
                
                {/* File Attachment */}
                {message.attachment_url && (
                  <div className="mt-2">
                    {message.message_type === 'file' && message.attachment_name?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      // Image attachment
                      <div className="rounded border overflow-hidden">
                        <Image 
                          src={message.attachment_url} 
                          alt={message.attachment_name}
                          width={400}
                          height={256}
                          className="max-w-full h-auto max-h-64 object-cover"
                        />
                        <div className="p-2 bg-gray-50 text-xs text-gray-600">
                          {message.attachment_name}
                        </div>
                      </div>
                    ) : (
                      // Other file types
                      <a 
                        href={message.attachment_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={cn(
                          'flex items-center gap-2 p-2 rounded border hover:bg-opacity-80 transition-colors',
                          isOwnMessage ? 'border-blue-300 bg-blue-500' : 'border-gray-300 bg-white'
                        )}
                      >
                        <Paperclip className="w-4 h-4" />
                        <span className="text-sm">{message.attachment_name}</span>
                      </a>
                    )}
                  </div>
                )}
                <div className={cn(
                  'text-xs mt-1 flex items-center gap-1',
                  isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                )}>
                  <Clock className="w-3 h-3" />
                  {new Date(message.created_at).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                  {isOwnMessage && message.is_read && (
                    <CheckCircle2 className="w-3 h-3 ml-1" />
                  )}
                </div>

                {/* Message Actions */}
                <div className="absolute top-1 right-1">
                  <MessageActions
                    messageId={message.id}
                    content={message.content}
                    attachmentUrl={message.attachment_url || undefined}
                    attachmentName={message.attachment_name || undefined}
                    isOwnMessage={isOwnMessage}
                    onReply={handleReply}
                    onDelete={handleDeleteMessage}
                  />
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="space-y-2">
          {/* Reply Indicator */}
          {replyingTo && (
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
              <span className="text-gray-600">Replying to: {replyingTo}...</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setReplyingTo(null)
                  setNewMessage('')
                }}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {/* File Upload Area */}
          <FileUpload
            onFileSelect={handleFileSelect}
            attachments={attachments}
            onRemoveAttachment={handleRemoveAttachment}
            disabled={loading || conversation.status === 'closed'}
          />
          
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value)
                  if (e.target.value.trim()) {
                    handleTypingStart()
                  } else {
                    handleTypingStop()
                  }
                }}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={loading || conversation.status === 'closed'}
                className="resize-none"
              />
            </div>
            <Button 
              onClick={sendMessage} 
              disabled={(!newMessage.trim() && attachments.length === 0) || loading || conversation.status === 'closed'}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {conversation.status === 'closed' && (
          <p className="text-sm text-gray-500 mt-2">This conversation has been closed.</p>
        )}
      </div>
    </Card>
  )
}
