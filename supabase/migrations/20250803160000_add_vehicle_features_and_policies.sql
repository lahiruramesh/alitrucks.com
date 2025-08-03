-- Add key features, specifications, and offers to vehicles table
ALTER TABLE vehicles 
ADD COLUMN key_features TEXT[],
ADD COLUMN specifications JSONB DEFAULT '{}',
ADD COLUMN offers TEXT[],
ADD COLUMN pickup_location TEXT,
ADD COLUMN return_location TEXT;

-- Create default policies table for the platform
CREATE TABLE IF NOT EXISTS platform_policies (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    policy_type TEXT NOT NULL CHECK (policy_type IN ('fuel', 'return', 'cancellation')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add policy references to vehicles table
ALTER TABLE vehicles 
ADD COLUMN fuel_policy_id BIGINT REFERENCES platform_policies(id),
ADD COLUMN return_policy_id BIGINT REFERENCES platform_policies(id),
ADD COLUMN cancellation_policy_id BIGINT REFERENCES platform_policies(id);

-- Create indexes for performance
CREATE INDEX idx_vehicles_key_features ON vehicles USING gin(key_features);
CREATE INDEX idx_vehicles_specifications ON vehicles USING gin(specifications);
CREATE INDEX idx_vehicles_offers ON vehicles USING gin(offers);
CREATE INDEX idx_platform_policies_type ON platform_policies(policy_type, is_active);

-- Insert default policies
INSERT INTO platform_policies (policy_type, title, content, is_default, is_active) VALUES
('fuel', 'Standard Fuel Policy', 'Vehicle will be provided with a full charge. Please return the vehicle with at least 80% charge to avoid additional fees. Charging stations are available at pickup and return locations.', true, true),
('fuel', 'Full Charge Return Policy', 'Vehicle must be returned with 100% charge. If returned with less than full charge, a recharging fee of $50 will apply.', false, true),
('fuel', 'Partial Charge Acceptable', 'Vehicle can be returned with any charge level above 20%. Additional charging fees will be calculated based on usage.', false, true),

('return', 'Standard Return Policy', 'Vehicle must be returned to the original pickup location during business hours (8 AM - 6 PM). Late returns incur a $25/hour fee.', true, true),
('return', 'Flexible Return Location', 'Vehicle can be returned to any of our partner locations within the city. Out-of-zone returns incur additional fees.', false, true),
('return', '24/7 Return Available', 'Vehicle can be returned any time using our secure key drop system. Instructions will be provided at pickup.', false, true),

('cancellation', 'Standard Cancellation Policy', 'Free cancellation up to 24 hours before pickup. Cancellations within 24 hours incur a 50% fee. No-shows forfeit the full rental amount.', true, true),
('cancellation', 'Flexible Cancellation', 'Free cancellation up to 2 hours before pickup. Late cancellations incur a 25% fee. No-shows forfeit 75% of rental amount.', false, true),
('cancellation', 'Strict Cancellation Policy', 'No refunds for cancellations within 48 hours of pickup. Earlier cancellations incur a 25% processing fee.', false, true);

-- Enable RLS for platform_policies
ALTER TABLE platform_policies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for platform_policies
CREATE POLICY "Public can view active policies" ON platform_policies
    FOR SELECT USING (is_active = true);

-- Admins can manage all policies
CREATE POLICY "Admins can manage all policies" ON platform_policies
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Create trigger for updated_at
CREATE TRIGGER update_platform_policies_updated_at 
    BEFORE UPDATE ON platform_policies 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
