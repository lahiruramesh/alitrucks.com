-- Fix infinite recursion in RLS policies
-- This migration fixes the circular dependency issue

-- First, drop all existing policies
DROP POLICY IF EXISTS "Users can view own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON conversations;
DROP POLICY IF EXISTS "Admins can manage all conversations" ON conversations;

DROP POLICY IF EXISTS "Users can view conversation messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can update messages" ON messages;
DROP POLICY IF EXISTS "Admins can manage all messages" ON messages;

DROP POLICY IF EXISTS "Users can view conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Admins can manage all participants" ON conversation_participants;

-- Create simplified, non-recursive policies for conversations
CREATE POLICY "conversations_select_policy" ON conversations
    FOR SELECT USING (
        user_id = auth.uid() OR 
        admin_id = auth.uid()
    );

CREATE POLICY "conversations_insert_policy" ON conversations
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "conversations_update_policy" ON conversations
    FOR UPDATE USING (
        user_id = auth.uid() OR 
        admin_id = auth.uid()
    );

-- Admin policy for conversations (separate from user policies)
CREATE POLICY "conversations_admin_policy" ON conversations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Create simplified policies for messages
CREATE POLICY "messages_select_policy" ON messages
    FOR SELECT USING (
        -- User can see messages where they are sender OR
        sender_id = auth.uid() OR
        -- Messages in conversations where user is participant
        conversation_id IN (
            SELECT id FROM conversations 
            WHERE user_id = auth.uid() OR admin_id = auth.uid()
        )
    );

CREATE POLICY "messages_insert_policy" ON messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        conversation_id IN (
            SELECT id FROM conversations 
            WHERE user_id = auth.uid() OR admin_id = auth.uid()
        )
    );

CREATE POLICY "messages_update_policy" ON messages
    FOR UPDATE USING (
        sender_id = auth.uid() OR
        conversation_id IN (
            SELECT id FROM conversations 
            WHERE user_id = auth.uid() OR admin_id = auth.uid()
        )
    );

-- Admin policy for messages
CREATE POLICY "messages_admin_policy" ON messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Create simplified policies for conversation_participants
CREATE POLICY "participants_select_policy" ON conversation_participants
    FOR SELECT USING (
        user_id = auth.uid() OR
        conversation_id IN (
            SELECT id FROM conversations 
            WHERE user_id = auth.uid() OR admin_id = auth.uid()
        )
    );

-- Admin policy for conversation participants
CREATE POLICY "participants_admin_policy" ON conversation_participants
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );
