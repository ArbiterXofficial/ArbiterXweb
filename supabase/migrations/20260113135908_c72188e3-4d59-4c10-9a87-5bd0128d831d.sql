-- Drop the overly permissive public profiles policy
DROP POLICY IF EXISTS "Users can view public profiles" ON public.profiles;

-- Create a more restrictive policy - users can only view their own profile
CREATE POLICY "Users can view their own profile only"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);