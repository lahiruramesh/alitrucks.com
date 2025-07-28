-- Add vehicle registration number and rejection reason
-- (status column already exists in the vehicles table)
ALTER TABLE public.vehicles
ADD COLUMN vehicle_registration_number TEXT,
ADD COLUMN rejection_reason TEXT;

-- Add a unique constraint to prevent duplicate vehicle registration numbers
ALTER TABLE public.vehicles
ADD CONSTRAINT vehicles_vehicle_registration_number_key UNIQUE (vehicle_registration_number);

-- Update existing vehicles to have a placeholder registration number
-- This is to ensure old data conforms to the new rules.
UPDATE public.vehicles
SET 
  vehicle_registration_number = 'ALITRUCK-' || substr(id::text, 1, 8)
WHERE vehicle_registration_number IS NULL;

-- Now that all rows have a value, make the column NOT NULL.
ALTER TABLE public.vehicles
ALTER COLUMN vehicle_registration_number SET NOT NULL;

-- Create an index for faster lookups on registration number
CREATE INDEX idx_vehicles_registration_number ON public.vehicles(vehicle_registration_number);

-- RLS policies are already set up in 20250630220000_vehicles_and_images.sql
-- No need to recreate them
