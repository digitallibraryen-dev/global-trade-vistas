
-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  icon TEXT DEFAULT 'Package',
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published services"
ON public.services FOR SELECT
USING (published = true OR is_admin());

CREATE POLICY "Admins can insert services"
ON public.services FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Admins can update services"
ON public.services FOR UPDATE
USING (is_admin());

CREATE POLICY "Admins can delete services"
ON public.services FOR DELETE
USING (is_admin());

CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
