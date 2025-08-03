-- Create platform_settings table for admin configuration
CREATE TABLE platform_settings (
    id BIGSERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coupons table for discount management
CREATE TABLE coupons (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
    discount_value DECIMAL(10,2) NOT NULL,
    minimum_amount DECIMAL(10,2) DEFAULT 0,
    maximum_discount DECIMAL(10,2),
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coupon_usage table to track coupon usage
CREATE TABLE coupon_usage (
    id BIGSERIAL PRIMARY KEY,
    coupon_id BIGINT REFERENCES coupons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    booking_id UUID REFERENCES bookings(id),
    discount_amount DECIMAL(10,2) NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default platform settings
INSERT INTO platform_settings (key, value, description) VALUES
('platform_fee_percentage', '5', 'Platform fee percentage (0-100)'),
('platform_fee_fixed', '0', 'Fixed platform fee amount'),
('platform_fee_type', '"percentage"', 'Platform fee type: percentage or fixed'),
('currency', '"USD"', 'Default platform currency'),
('tax_rate', '8.5', 'Tax rate percentage'),
('carbon_calculation_enabled', 'true', 'Enable carbon emission calculations'),
('carbon_diesel_emission_per_mile', '2.68', 'CO2 kg per mile for diesel trucks'),
('carbon_electric_emission_per_mile', '0.4', 'CO2 kg per mile for electric trucks'),
('minimum_booking_hours', '4', 'Minimum booking duration in hours'),
('booking_advance_days', '30', 'Maximum days in advance for booking');

-- Create indexes
CREATE INDEX idx_platform_settings_key ON platform_settings(key);
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(is_active);
CREATE INDEX idx_coupon_usage_coupon_id ON coupon_usage(coupon_id);
CREATE INDEX idx_coupon_usage_user_id ON coupon_usage(user_id);

-- Enable RLS
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for platform_settings (Admin only)
CREATE POLICY "Admins can manage platform settings" ON platform_settings
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- RLS Policies for coupons
CREATE POLICY "Admins can manage coupons" ON coupons
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

CREATE POLICY "Users can view active coupons" ON coupons
    FOR SELECT
    USING (is_active = true AND valid_from <= NOW() AND (valid_until IS NULL OR valid_until >= NOW()));

-- RLS Policies for coupon_usage
CREATE POLICY "Users can view their coupon usage" ON coupon_usage
    FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Admins can view all coupon usage" ON coupon_usage
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

CREATE POLICY "System can insert coupon usage" ON coupon_usage
    FOR INSERT
    WITH CHECK (user_id = auth.uid());
