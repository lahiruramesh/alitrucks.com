-- Create storage bucket for vehicle images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'vehicle-images',
    'vehicle-images',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
);

-- Create storage policies for vehicle images bucket

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload vehicle images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'vehicle-images' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Allow authenticated users to update their own images
CREATE POLICY "Users can update own vehicle images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'vehicle-images' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Allow authenticated users to delete their own images
CREATE POLICY "Users can delete own vehicle images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'vehicle-images' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Allow public to view all images in the bucket
CREATE POLICY "Public can view vehicle images" ON storage.objects
    FOR SELECT USING (bucket_id = 'vehicle-images');
