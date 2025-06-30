-- Insert sample vehicle types
INSERT INTO vehicle_types (name) VALUES 
('Box Truck'),
('Pickup Truck'),
('Semi-Trailer'),
('Cargo Van'),
('Flatbed Truck'),
('Refrigerated Truck');

-- Insert sample vehicle categories  
INSERT INTO vehicle_categories (name) VALUES
('Light Duty'),
('Medium Duty'),
('Heavy Duty'),
('Commercial'),
('Personal Use');

-- Insert sample brands
INSERT INTO brands (name) VALUES
('Tesla'),
('Ford'),
('Rivian'),
('Mercedes-Benz'),
('Volvo'),
('BYD'),
('Nikola');

-- Insert sample models (using brand IDs)
INSERT INTO models (name, brand_id) VALUES
('Semi', 1),  -- Tesla Semi
('Cybertruck', 1),  -- Tesla Cybertruck
('F-150 Lightning', 2),  -- Ford F-150 Lightning
('E-Transit', 2),  -- Ford E-Transit
('R1T', 3),  -- Rivian R1T
('R1V', 3),  -- Rivian R1V
('eActros', 4),  -- Mercedes-Benz eActros
('eSprinter', 4),  -- Mercedes-Benz eSprinter
('FE Electric', 5),  -- Volvo FE Electric
('FL Electric', 5),  -- Volvo FL Electric
('T3', 6),  -- BYD T3
('T7', 6),  -- BYD T7
('Tre', 7);  -- Nikola Tre

-- Insert sample rental purposes
INSERT INTO rental_purposes (name) VALUES
('Moving & Relocation'),
('Delivery & Logistics'),
('Construction'),
('Landscaping'),
('Event Transport'),
('Personal Use'),
('Commercial Transport');

-- Insert sample fuel types
INSERT INTO fuel_types (name) VALUES
('Electric'),
('Hybrid Electric'),
('Battery Electric'),
('Hydrogen Fuel Cell');
