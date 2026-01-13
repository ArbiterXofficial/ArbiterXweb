-- Add DELETE policy so users can delete their own profile (GDPR compliance)
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Remove duplicate SELECT policy
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;