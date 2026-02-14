-- Change default status to 'pending' so all reviews require admin approval
ALTER TABLE public.reviews ALTER COLUMN status SET DEFAULT 'pending';

-- Allow users to delete their own reviews
CREATE POLICY "Users can delete own reviews"
ON public.reviews
FOR DELETE
USING (auth.uid() = user_id);