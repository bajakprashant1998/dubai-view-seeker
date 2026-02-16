
-- Create storage bucket for tour images
INSERT INTO storage.buckets (id, name, public) VALUES ('tour-images', 'tour-images', true);

-- Allow authenticated users to upload
CREATE POLICY "Admins can upload tour images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'tour-images' AND public.has_role(auth.uid(), 'admin'));

-- Allow public read
CREATE POLICY "Tour images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'tour-images');

-- Allow admins to update
CREATE POLICY "Admins can update tour images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'tour-images' AND public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete
CREATE POLICY "Admins can delete tour images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'tour-images' AND public.has_role(auth.uid(), 'admin'));
