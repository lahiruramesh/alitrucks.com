-- Create conversations table
CREATE TABLE conversations (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    
    -- Participants
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Conversation metadata
    subject TEXT,
    category TEXT CHECK (category IN ('vehicle_approval', 'account_issues', 'policy_questions', 'booking_help', 'payment_issues', 'technical_support', 'general')),
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    
    -- Context references
    vehicle_id BIGINT REFERENCES vehicles(id) ON DELETE SET NULL,
    booking_id BIGINT,  -- Will reference bookings table when created
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- Create messages table
CREATE TABLE messages (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    
    -- Message content
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
    
    -- Message status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    
    -- Attachments
    attachment_url TEXT,
    attachment_name TEXT,
    attachment_size INTEGER,
    attachment_mime_type TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create conversation_participants table for future group chat support
CREATE TABLE conversation_participants (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'participant' CHECK (role IN ('participant', 'admin', 'moderator')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    left_at TIMESTAMPTZ,
    
    UNIQUE(conversation_id, user_id)
);

-- Create indexes for performance
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_admin_id ON conversations(admin_id);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_conversations_priority ON conversations(priority);
CREATE INDEX idx_conversations_category ON conversations(category);
CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at DESC);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_unread ON messages(conversation_id, is_read) WHERE is_read = FALSE;

CREATE INDEX idx_conversation_participants_conversation ON conversation_participants(conversation_id);
CREATE INDEX idx_conversation_participants_user ON conversation_participants(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations table

-- Users can view conversations they are part of
CREATE POLICY "Users can view own conversations" ON conversations
    FOR SELECT USING (
        user_id = auth.uid() OR 
        admin_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM conversation_participants 
            WHERE conversation_participants.conversation_id = conversations.id 
            AND conversation_participants.user_id = auth.uid()
        )
    );

-- Users can create conversations (as user_id)
CREATE POLICY "Users can create conversations" ON conversations
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own conversations
CREATE POLICY "Users can update own conversations" ON conversations
    FOR UPDATE USING (
        user_id = auth.uid() OR 
        admin_id = auth.uid()
    );

-- Admins can view and manage all conversations
CREATE POLICY "Admins can manage all conversations" ON conversations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- RLS Policies for messages table

-- Users can view messages in conversations they are part of
CREATE POLICY "Users can view conversation messages" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE conversations.id = messages.conversation_id 
            AND (
                conversations.user_id = auth.uid() OR 
                conversations.admin_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM conversation_participants 
                    WHERE conversation_participants.conversation_id = conversations.id 
                    AND conversation_participants.user_id = auth.uid()
                )
            )
        )
    );

-- Users can send messages in conversations they are part of
CREATE POLICY "Users can send messages" ON messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE conversations.id = messages.conversation_id 
            AND (
                conversations.user_id = auth.uid() OR 
                conversations.admin_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM conversation_participants 
                    WHERE conversation_participants.conversation_id = conversations.id 
                    AND conversation_participants.user_id = auth.uid()
                )
            )
        )
    );

-- Users can update their own messages (for read status, etc.)
CREATE POLICY "Users can update messages" ON messages
    FOR UPDATE USING (
        sender_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE conversations.id = messages.conversation_id 
            AND (conversations.user_id = auth.uid() OR conversations.admin_id = auth.uid())
        )
    );

-- Admins can manage all messages
CREATE POLICY "Admins can manage all messages" ON messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- RLS Policies for conversation_participants table

-- Users can view participants of conversations they are part of
CREATE POLICY "Users can view conversation participants" ON conversation_participants
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE conversations.id = conversation_participants.conversation_id 
            AND (conversations.user_id = auth.uid() OR conversations.admin_id = auth.uid())
        )
    );

-- Admins can manage all conversation participants
CREATE POLICY "Admins can manage all participants" ON conversation_participants
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Create function to update conversation's last_message_at when a message is added
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations 
    SET 
        last_message_at = NEW.created_at,
        updated_at = NEW.created_at
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating conversation last_message_at
CREATE TRIGGER update_conversation_last_message_trigger
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_last_message();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_conversations_updated_at 
    BEFORE UPDATE ON conversations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at 
    BEFORE UPDATE ON messages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
