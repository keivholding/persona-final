-- Create storage bucket for attribute images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'attribute-images',
  'attribute-images',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
);

-- Since we're using custom auth (not Supabase Auth), we'll disable RLS for now
-- and handle permissions in our backend code
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Or if you prefer to keep RLS enabled, use these policies that allow all operations
-- for the attribute-images bucket (since our backend handles auth)
CREATE POLICY "Allow all operations on attribute-images" ON storage.objects
FOR ALL USING (bucket_id = 'attribute-images');
