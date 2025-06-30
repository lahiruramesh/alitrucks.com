-- Create vehicles table
CREATE TABLE vehicles (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic vehicle information
    name TEXT NOT NULL,
    description TEXT,
    year INTEGER NOT NULL,
    mileage INTEGER,
    location TEXT NOT NULL,
    
    -- Vehicle attributes (foreign keys)
    vehicle_type_id BIGINT REFERENCES vehicle_types(id),
    vehicle_category_id BIGINT REFERENCES vehicle_categories(id),
    brand_id BIGINT REFERENCES brands(id),
    model_id BIGINT REFERENCES models(id),
    fuel_type_id BIGINT REFERENCES fuel_types(id),
    
    -- Pricing
    price_per_day DECIMAL(10,2),
    price_per_week DECIMAL(10,2),
    price_per_month DECIMAL(10,2),
    
    -- Vehicle specifications
    max_weight_capacity INTEGER, -- in pounds
    cargo_volume INTEGER, -- in cubic feet
    range_miles INTEGER, -- for electric vehicles
    charging_time_hours INTEGER, -- for electric vehicles
    
    -- Status and metadata
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'inactive')),
    admin_notes TEXT, -- For admin feedback on rejections
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    
    -- Search optimization
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(location, ''))
    ) STORED
);

-- Create vehicle_images table
CREATE TABLE vehicle_images (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    vehicle_id BIGINT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    
    -- Image information
    image_url TEXT NOT NULL,
    image_path TEXT NOT NULL, -- Path in Supabase Storage
    file_name TEXT NOT NULL,
    file_size INTEGER, -- in bytes
    mime_type TEXT,
    
    -- Image metadata
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    alt_text TEXT,
    
    -- Timestamps
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(vehicle_id, display_order)
);

-- Create vehicle_availability table
CREATE TABLE vehicle_availability (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    vehicle_id BIGINT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    
    -- Availability dates
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    
    -- Pricing overrides for specific periods
    special_price_per_day DECIMAL(10,2),
    
    -- Metadata
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_date_range CHECK (end_date >= start_date),
    UNIQUE(vehicle_id, start_date, end_date)
);

-- Create indexes for performance
CREATE INDEX idx_vehicles_seller_id ON vehicles(seller_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_location ON vehicles(location);
CREATE INDEX idx_vehicles_search_vector ON vehicles USING gin(search_vector);
CREATE INDEX idx_vehicles_created_at ON vehicles(created_at DESC);

CREATE INDEX idx_vehicle_images_vehicle_id ON vehicle_images(vehicle_id);
CREATE INDEX idx_vehicle_images_primary ON vehicle_images(vehicle_id, is_primary);
CREATE INDEX idx_vehicle_images_order ON vehicle_images(vehicle_id, display_order);

CREATE INDEX idx_vehicle_availability_vehicle_id ON vehicle_availability(vehicle_id);
CREATE INDEX idx_vehicle_availability_dates ON vehicle_availability(start_date, end_date);

-- Enable Row Level Security (RLS)
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_availability ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vehicles table

-- Sellers can view and manage their own vehicles
CREATE POLICY "Sellers can view own vehicles" ON vehicles
    FOR SELECT USING (seller_id = auth.uid());

CREATE POLICY "Sellers can insert own vehicles" ON vehicles
    FOR INSERT WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Sellers can update own vehicles" ON vehicles
    FOR UPDATE USING (seller_id = auth.uid());

CREATE POLICY "Sellers can delete own vehicles" ON vehicles
    FOR DELETE USING (seller_id = auth.uid());

-- Public can view approved vehicles
CREATE POLICY "Public can view approved vehicles" ON vehicles
    FOR SELECT USING (status = 'approved');

-- Admins can view and manage all vehicles
CREATE POLICY "Admins can manage all vehicles" ON vehicles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- RLS Policies for vehicle_images table

-- Sellers can manage images for their own vehicles
CREATE POLICY "Sellers can manage own vehicle images" ON vehicle_images
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM vehicles 
            WHERE vehicles.id = vehicle_images.vehicle_id 
            AND vehicles.seller_id = auth.uid()
        )
    );

-- Public can view images for approved vehicles
CREATE POLICY "Public can view approved vehicle images" ON vehicle_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM vehicles 
            WHERE vehicles.id = vehicle_images.vehicle_id 
            AND vehicles.status = 'approved'
        )
    );

-- Admins can manage all vehicle images
CREATE POLICY "Admins can manage all vehicle images" ON vehicle_images
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- RLS Policies for vehicle_availability table

-- Sellers can manage availability for their own vehicles
CREATE POLICY "Sellers can manage own vehicle availability" ON vehicle_availability
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM vehicles 
            WHERE vehicles.id = vehicle_availability.vehicle_id 
            AND vehicles.seller_id = auth.uid()
        )
    );

-- Public can view availability for approved vehicles
CREATE POLICY "Public can view approved vehicle availability" ON vehicle_availability
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM vehicles 
            WHERE vehicles.id = vehicle_availability.vehicle_id 
            AND vehicles.status = 'approved'
        )
    );

-- Admins can manage all vehicle availability
CREATE POLICY "Admins can manage all vehicle availability" ON vehicle_availability
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for vehicles table
CREATE TRIGGER update_vehicles_updated_at 
    BEFORE UPDATE ON vehicles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
