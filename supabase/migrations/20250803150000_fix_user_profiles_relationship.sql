-- Fix the vehicles-user_profiles relationship
-- The issue is that vehicles.seller_id should reference user_profiles.id, not auth.users.id

-- Drop the old constraint
ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_seller_id_fkey;

-- Add the correct foreign key pointing to user_profiles
ALTER TABLE vehicles 
ADD CONSTRAINT vehicles_seller_id_fkey 
FOREIGN KEY (seller_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

-- Update RLS policies to work with the corrected relationship
DROP POLICY IF EXISTS "Sellers can manage own vehicles" ON vehicles;
CREATE POLICY "Sellers can manage own vehicles" ON vehicles
    FOR ALL USING (
        seller_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = vehicles.seller_id 
            AND user_profiles.id = auth.uid()
        )
    );

-- Ensure we have proper indexes
CREATE INDEX IF NOT EXISTS idx_vehicles_seller_id ON vehicles(seller_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_id ON user_profiles(id);
