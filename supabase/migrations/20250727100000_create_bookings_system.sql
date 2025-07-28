-- Create bookings system tables
-- This migration adds booking functionality to the AliTrucks platform

-- Create booking status enum
DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'active', 'completed', 'cancelled', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create payment status enum
DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'partial_refund');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- References
    vehicle_id BIGINT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Booking details
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    pickup_time TIME DEFAULT '09:00:00',
    return_time TIME DEFAULT '18:00:00',
    pickup_location TEXT NOT NULL,
    return_location TEXT,
    
    -- Pricing
    price_per_day DECIMAL(10,2) NOT NULL,
    total_days INTEGER NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    service_fee DECIMAL(10,2) DEFAULT 0,
    taxes DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Status
    status booking_status NOT NULL DEFAULT 'pending',
    payment_status payment_status NOT NULL DEFAULT 'pending',
    
    -- Additional details
    special_requests TEXT,
    renter_notes TEXT,
    seller_notes TEXT,
    cancellation_reason TEXT,
    
    -- Contact information
    renter_phone TEXT,
    renter_email TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT valid_date_range CHECK (end_date >= start_date),
    CONSTRAINT positive_amounts CHECK (
        price_per_day > 0 AND 
        total_days > 0 AND 
        subtotal >= 0 AND 
        total_amount >= 0
    )
);

-- Create booking reviews table
CREATE TABLE IF NOT EXISTS booking_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reviewed_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vehicle_id BIGINT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    
    -- Review content
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    review_type TEXT NOT NULL CHECK (review_type IN ('vehicle', 'seller', 'buyer')),
    
    -- Flags
    is_public BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure one review per booking per reviewer
    UNIQUE(booking_id, reviewer_id, review_type)
);

-- Create booking messages table for communication
CREATE TABLE IF NOT EXISTS booking_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Message content
    message TEXT NOT NULL,
    message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'system', 'status_update')),
    
    -- Metadata
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_bookings_vehicle_id ON bookings(vehicle_id);
CREATE INDEX idx_bookings_buyer_id ON bookings(buyer_id);
CREATE INDEX idx_bookings_seller_id ON bookings(seller_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);

CREATE INDEX idx_booking_reviews_booking_id ON booking_reviews(booking_id);
CREATE INDEX idx_booking_reviews_vehicle_id ON booking_reviews(vehicle_id);
CREATE INDEX idx_booking_reviews_rating ON booking_reviews(rating);

CREATE INDEX idx_booking_messages_booking_id ON booking_messages(booking_id);
CREATE INDEX idx_booking_messages_created_at ON booking_messages(booking_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookings table

-- Buyers can view and manage their own bookings
CREATE POLICY "Buyers can view own bookings" ON bookings
    FOR SELECT USING (buyer_id = auth.uid());

CREATE POLICY "Buyers can create bookings" ON bookings
    FOR INSERT WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Buyers can update own bookings" ON bookings
    FOR UPDATE USING (buyer_id = auth.uid());

-- Sellers can view and manage bookings for their vehicles
CREATE POLICY "Sellers can view vehicle bookings" ON bookings
    FOR SELECT USING (seller_id = auth.uid());

CREATE POLICY "Sellers can update vehicle bookings" ON bookings
    FOR UPDATE USING (seller_id = auth.uid());

-- Admins can view and manage all bookings
CREATE POLICY "Admins can manage all bookings" ON bookings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- RLS Policies for booking_reviews table

-- Users can view public reviews
CREATE POLICY "Public can view public reviews" ON booking_reviews
    FOR SELECT USING (is_public = true);

-- Reviewers can manage their own reviews
CREATE POLICY "Users can manage own reviews" ON booking_reviews
    FOR ALL USING (reviewer_id = auth.uid());

-- Reviewed users can view reviews about them
CREATE POLICY "Users can view reviews about them" ON booking_reviews
    FOR SELECT USING (reviewed_user_id = auth.uid());

-- Admins can manage all reviews
CREATE POLICY "Admins can manage all reviews" ON booking_reviews
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- RLS Policies for booking_messages table

-- Booking participants can view and send messages
CREATE POLICY "Booking participants can view messages" ON booking_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM bookings 
            WHERE bookings.id = booking_messages.booking_id 
            AND (bookings.buyer_id = auth.uid() OR bookings.seller_id = auth.uid())
        )
    );

CREATE POLICY "Booking participants can send messages" ON booking_messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM bookings 
            WHERE bookings.id = booking_messages.booking_id 
            AND (bookings.buyer_id = auth.uid() OR bookings.seller_id = auth.uid())
        )
    );

CREATE POLICY "Users can update own messages" ON booking_messages
    FOR UPDATE USING (sender_id = auth.uid());

-- Admins can manage all booking messages
CREATE POLICY "Admins can manage all booking messages" ON booking_messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_booking_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for auto-updating updated_at
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_booking_updated_at();

CREATE TRIGGER update_booking_reviews_updated_at
    BEFORE UPDATE ON booking_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_booking_updated_at();

-- Create function to automatically set seller_id when booking is created
CREATE OR REPLACE FUNCTION set_booking_seller_id()
RETURNS TRIGGER AS $$
BEGIN
    -- Get the seller_id from the vehicle
    SELECT seller_id INTO NEW.seller_id
    FROM vehicles
    WHERE id = NEW.vehicle_id;
    
    IF NEW.seller_id IS NULL THEN
        RAISE EXCEPTION 'Vehicle not found or has no seller';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-set seller_id
CREATE TRIGGER set_booking_seller_id_trigger
    BEFORE INSERT ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION set_booking_seller_id();

-- Create function to check vehicle availability
CREATE OR REPLACE FUNCTION check_vehicle_availability()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if vehicle is available for the requested dates
    IF EXISTS (
        SELECT 1 FROM bookings 
        WHERE vehicle_id = NEW.vehicle_id 
        AND status IN ('confirmed', 'active')
        AND (
            (NEW.start_date BETWEEN start_date AND end_date) OR
            (NEW.end_date BETWEEN start_date AND end_date) OR
            (start_date BETWEEN NEW.start_date AND NEW.end_date)
        )
        AND (TG_OP = 'INSERT' OR id != NEW.id)
    ) THEN
        RAISE EXCEPTION 'Vehicle is not available for the selected dates';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to check availability on booking creation/update
CREATE TRIGGER check_vehicle_availability_trigger
    BEFORE INSERT OR UPDATE ON bookings
    FOR EACH ROW
    WHEN (NEW.status IN ('confirmed', 'active'))
    EXECUTE FUNCTION check_vehicle_availability();
