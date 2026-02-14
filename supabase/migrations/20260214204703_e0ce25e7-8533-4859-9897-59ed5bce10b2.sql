
-- Allow anyone to read basic profile info for users who have approved reviews
CREATE POLICY "Anyone can view profiles of reviewers"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.reviews
    WHERE reviews.user_id = profiles.user_id
    AND reviews.status = 'approved'
  )
);
