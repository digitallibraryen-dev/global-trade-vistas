
-- Social media links table
CREATE TABLE public.social_media_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL CHECK (platform IN ('instagram', 'whatsapp', 'tiktok', 'snapchat', 'wechat')),
  label text NOT NULL DEFAULT '',
  value text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.social_media_links ENABLE ROW LEVEL SECURITY;

-- Anyone can read enabled links
CREATE POLICY "Anyone can view enabled social links"
ON public.social_media_links
FOR SELECT
USING (enabled = true OR is_admin());

-- Admins can manage
CREATE POLICY "Admins can insert social links"
ON public.social_media_links
FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Admins can update social links"
ON public.social_media_links
FOR UPDATE
USING (is_admin());

CREATE POLICY "Admins can delete social links"
ON public.social_media_links
FOR DELETE
USING (is_admin());

-- Timestamp trigger
CREATE TRIGGER update_social_media_links_updated_at
BEFORE UPDATE ON public.social_media_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
