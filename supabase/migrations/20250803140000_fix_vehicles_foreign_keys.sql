-- Fix vehicles table foreign key relationships for proper PostgREST queries
-- This migration ensures vehicles can properly join with user_profiles, brands, and models

-- First, ensure the vehicles table has the correct foreign key names that PostgREST can follow

-- Fix the seller_id foreign key to point to auth.users (not user_profiles for now)
-- This ensures proper authentication flow
ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_seller_id_fkey;
ALTER TABLE vehicles 
ADD CONSTRAINT vehicles_seller_id_fkey 
FOREIGN KEY (seller_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Ensure brand_id foreign key exists and is properly named
ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_brand_id_fkey;
ALTER TABLE vehicles 
ADD CONSTRAINT vehicles_brand_id_fkey 
FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL;

-- Ensure model_id foreign key exists and is properly named  
ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_model_id_fkey;
ALTER TABLE vehicles 
ADD CONSTRAINT vehicles_model_id_fkey 
FOREIGN KEY (model_id) REFERENCES models(id) ON DELETE SET NULL;

-- Add vehicle_registration_number column if it doesn't exist
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS vehicle_registration_number TEXT;

-- Add rejection_reason column for admin feedback
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Create index on vehicle_registration_number for uniqueness checks
CREATE UNIQUE INDEX IF NOT EXISTS idx_vehicles_registration_number 
ON vehicles(vehicle_registration_number) 
WHERE vehicle_registration_number IS NOT NULL;

-- Update RLS policies to work with user_profiles relationship
DROP POLICY IF EXISTS "Sellers can manage own vehicles" ON vehicles;
CREATE POLICY "Sellers can manage own vehicles" ON vehicles
    FOR ALL USING (
        seller_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.id = vehicles.seller_id
        )
    );

-- Policy for public to view approved vehicles
DROP POLICY IF EXISTS "Public can view approved vehicles" ON vehicles;
CREATE POLICY "Public can view approved vehicles" ON vehicles
    FOR SELECT USING (status = 'approved');

-- Policy for admins to manage all vehicles
DROP POLICY IF EXISTS "Admins can manage all vehicles" ON vehicles;
CREATE POLICY "Admins can manage all vehicles" ON vehicles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );
