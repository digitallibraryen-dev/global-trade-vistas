-- Add a FK from reviews to profiles so PostgREST can resolve the join
ALTER TABLE public.reviews
ADD CONSTRAINT reviews_profile_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;