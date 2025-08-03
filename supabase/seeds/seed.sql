-- ============================================================================
-- AliTrucks Database Seed Script
-- ============================================================================
-- -- This script seeds the database with sample data for development and testing
-- -- Note: Creates user profiles that can be linked to auth users via signup
-- -- Test accounts can be created through the Supabase Auth API or dashboard

-- -- ============================================================================
-- -- CREATE TEST USERS IN SUPABASE AUTH
-- -- ============================================================================

-- -- Insert users into auth.users (requires superuser privileges)
-- -- Password: Asd123 (hashed using bcrypt)
-- -- You may need to adjust the hashed password if your Supabase instance uses a different hashing method

-- -- Example bcrypt hash for 'Asd123': $2a$10$wH8vQw6F9QwQw6F9QwQw6eQwQw6F9QwQw6F9QwQw6F9QwQw6F9QwQw6
-- -- Replace with a valid hash for your environment

-- INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
-- VALUES
--     ('00000000-0000-0000-0000-000000000001', 'admin@alitrucks.com', '$2a$10$wH8vQw6F9QwQw6F9QwQw6eQwQw6F9QwQw6F9QwQw6F9QwQw6F9QwQw6', NOW()),
--     ('00000000-0000-0000-0000-000000000002', 'seller@alitrucks.com', '$2a$10$wH8vQw6F9QwQw6F9QwQw6eQwQw6F9QwQw6F9QwQw6F9QwQw6F9QwQw6', NOW()),
--     ('00000000-0000-0000-0000-000000000003', 'buyer@alitrucks.com', '$2a$10$wH8vQw6F9QwQw6F9QwQw6eQwQw6F9QwQw6F9QwQw6F9QwQw6F9QwQw6', NOW())
-- ON CONFLICT (email) DO NOTHING;

-- -- The user profile trigger will automatically create user_profiles entries

-- -- Update user_profiles to set the correct roles
-- UPDATE user_profiles SET role = 'admin' WHERE email = 'admin@alitrucks.com';
-- UPDATE user_profiles SET role = 'seller' WHERE email = 'seller@alitrucks.com';
-- UPDATE user_profiles SET role = 'buyer' WHERE email = 'buyer@alitrucks.com';

-- ============================================================================
-- VEHICLE ATTRIBUTES SEEDING (Reference Data)
-- ============================================================================

-- Insert vehicle types
INSERT INTO vehicle_types (name) VALUES
('Pickup Truck'),
('Cargo Van'),
('Box Truck'),
('Flatbed Truck'),
('Dump Truck'),
('Tow Truck'),
('Delivery Van'),
('Moving Truck')
ON CONFLICT (name) DO NOTHING;

-- Insert vehicle categories
INSERT INTO vehicle_categories (name) VALUES
('Light Duty'),
('Medium Duty'),
('Heavy Duty'),
('Commercial'),
('Personal'),
('Construction'),
('Delivery'),
('Specialty')
ON CONFLICT (name) DO NOTHING;

-- Insert brands
INSERT INTO brands (name) VALUES
('Ford'),
('Chevrolet'),
('GMC'),
('Ram'),
('Toyota'),
('Nissan'),
('Isuzu'),
('Freightliner'),
('International'),
('Peterbilt'),
('Kenworth'),
('Mercedes-Benz')
ON CONFLICT (name) DO NOTHING;

-- Insert models
INSERT INTO models (brand_id, name) VALUES
((SELECT id FROM brands WHERE name = 'Ford'), 'F-150'),
((SELECT id FROM brands WHERE name = 'Ford'), 'F-250 Super Duty'),
((SELECT id FROM brands WHERE name = 'Ford'), 'F-350 Super Duty'),
((SELECT id FROM brands WHERE name = 'Ford'), 'Transit'),
((SELECT id FROM brands WHERE name = 'Ford'), 'E-350'),
((SELECT id FROM brands WHERE name = 'Chevrolet'), 'Silverado 1500'),
((SELECT id FROM brands WHERE name = 'Chevrolet'), 'Silverado 2500HD'),
((SELECT id FROM brands WHERE name = 'Chevrolet'), 'Silverado 3500HD'),
((SELECT id FROM brands WHERE name = 'Chevrolet'), 'Express'),
((SELECT id FROM brands WHERE name = 'GMC'), 'Sierra 1500'),
((SELECT id FROM brands WHERE name = 'GMC'), 'Sierra 2500HD'),
((SELECT id FROM brands WHERE name = 'GMC'), 'Savana'),
((SELECT id FROM brands WHERE name = 'Ram'), '1500'),
((SELECT id FROM brands WHERE name = 'Ram'), '2500'),
((SELECT id FROM brands WHERE name = 'Ram'), '3500'),
((SELECT id FROM brands WHERE name = 'Ram'), 'ProMaster'),
((SELECT id FROM brands WHERE name = 'Toyota'), 'Tundra'),
((SELECT id FROM brands WHERE name = 'Toyota'), 'Tacoma'),
((SELECT id FROM brands WHERE name = 'Nissan'), 'Titan'),
((SELECT id FROM brands WHERE name = 'Nissan'), 'NV200'),
((SELECT id FROM brands WHERE name = 'Isuzu'), 'NPR'),
((SELECT id FROM brands WHERE name = 'Mercedes-Benz'), 'Sprinter'),
((SELECT id FROM brands WHERE name = 'Mercedes-Benz'), 'Sprinter 2500'),
((SELECT id FROM brands WHERE name = 'Mercedes-Benz'), 'Sprinter 3500'),
((SELECT id FROM brands WHERE name = 'Freightliner'), 'Cascadia')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Insert rental purposes
INSERT INTO rental_purposes (name) VALUES
('Moving'),
('Delivery'),
('Construction'),
('Landscaping'),
('Event Setup'),
('Furniture Transport'),
('Appliance Delivery'),
('Commercial Use'),
('Personal Project'),
('Emergency Service')
ON CONFLICT (name) DO NOTHING;

-- Insert fuel types
INSERT INTO fuel_types (name) VALUES
('Gasoline'),
('Diesel'),
('Electric'),
('Hybrid'),
('Propane (LPG)'),
('Compressed Natural Gas (CNG)'),
('Biodiesel')
ON CONFLICT (name) DO NOTHING;