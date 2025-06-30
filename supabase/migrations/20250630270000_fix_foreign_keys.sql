-- Fix foreign key relationship for messages.sender_id
-- This migration creates proper relationships that PostgREST can follow

-- First, check if user_profiles table exists and has the right structure
-- The user_profiles should have an 'id' column that references auth.users(id)

-- Drop the existing foreign key constraint on messages.sender_id
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;

-- Add a new foreign key constraint that references user_profiles.id instead
-- This allows PostgREST to follow the relationship within the public schema
ALTER TABLE messages 
ADD CONSTRAINT messages_sender_id_fkey 
FOREIGN KEY (sender_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

-- Also fix the conversations table foreign keys to use user_profiles
ALTER TABLE conversations DROP CONSTRAINT IF EXISTS conversations_user_id_fkey;
ALTER TABLE conversations DROP CONSTRAINT IF EXISTS conversations_admin_id_fkey;

ALTER TABLE conversations 
ADD CONSTRAINT conversations_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE conversations 
ADD CONSTRAINT conversations_admin_id_fkey 
FOREIGN KEY (admin_id) REFERENCES user_profiles(id) ON DELETE SET NULL;

-- Fix conversation_participants table as well
ALTER TABLE conversation_participants DROP CONSTRAINT IF EXISTS conversation_participants_user_id_fkey;

ALTER TABLE conversation_participants 
ADD CONSTRAINT conversation_participants_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;
