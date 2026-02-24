
-- Table to store global counters
CREATE TABLE public.site_counters (
  id text PRIMARY KEY,
  value bigint NOT NULL DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Seed with current base visitor count
INSERT INTO public.site_counters (id, value) VALUES ('visitors', 1449);

-- Enable RLS
ALTER TABLE public.site_counters ENABLE ROW LEVEL SECURITY;

-- Anyone can read counters
CREATE POLICY "Anyone can read counters"
  ON public.site_counters FOR SELECT
  USING (true);

-- Atomic increment function
CREATE OR REPLACE FUNCTION public.increment_counter(counter_id text)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_val bigint;
BEGIN
  UPDATE site_counters
    SET value = value + 1, updated_at = now()
    WHERE id = counter_id
  RETURNING value INTO new_val;
  RETURN new_val;
END;
$$;
