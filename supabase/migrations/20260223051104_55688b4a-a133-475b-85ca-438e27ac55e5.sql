-- Add qr_code_url column to social_media_links for WeChat QR codes
ALTER TABLE public.social_media_links
ADD COLUMN qr_code_url text DEFAULT NULL;