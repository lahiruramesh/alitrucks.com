-- Migration: Create buyer_profiles table
-- This table stores buyer verification information including driving license details

CREATE TABLE buyer_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  license_number TEXT NOT NULL,
  license_expiry_date DATE NOT NULL,
  driving_license_url TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  verification_notes TEXT,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Ensure one profile per user
  UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_buyer_profiles_user_id ON buyer_profiles(user_id);
CREATE INDEX idx_buyer_profiles_verification_status ON buyer_profiles(verification_status);
CREATE INDEX idx_buyer_profiles_license_expiry ON buyer_profiles(license_expiry_date);

-- Enable RLS (Row Level Security)
ALTER TABLE buyer_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies
-- Users can view and edit their own profile
CREATE POLICY "Users can view own buyer profile" ON buyer_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own buyer profile" ON buyer_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own buyer profile" ON buyer_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins can view and manage all profiles
CREATE POLICY "Admins can manage all buyer profiles" ON buyer_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create storage bucket for buyer documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('buyer-documents', 'buyer-documents', true);

-- Storage policies for buyer documents
CREATE POLICY "Users can upload their own documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'buyer-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'buyer-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all buyer documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'buyer-documents' AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_buyer_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_buyer_profiles_updated_at
  BEFORE UPDATE ON buyer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_buyer_profiles_updated_at();
