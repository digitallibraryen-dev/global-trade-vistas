
-- Add multilingual columns to products
ALTER TABLE public.products
  ADD COLUMN name_ar TEXT,
  ADD COLUMN name_zh TEXT,
  ADD COLUMN description_ar TEXT,
  ADD COLUMN description_zh TEXT;

-- Add multilingual columns to services
ALTER TABLE public.services
  ADD COLUMN title_ar TEXT,
  ADD COLUMN title_zh TEXT,
  ADD COLUMN description_ar TEXT,
  ADD COLUMN description_zh TEXT;
