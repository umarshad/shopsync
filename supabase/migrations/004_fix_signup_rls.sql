-- Fix RLS policy to allow profile creation during signup
-- The issue is that after signup, the session might not be immediately available
-- Solution: Create a function that can create profiles with elevated privileges

-- Drop the existing insert policy
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create a function that allows profile creation after signup
-- This function runs with SECURITY DEFINER, so it bypasses RLS
CREATE OR REPLACE FUNCTION public.create_user_profile(
  user_id UUID,
  shop_name TEXT,
  user_pin TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, shop_id, shop_name, role, pin)
  VALUES (
    user_id,
    gen_random_uuid(),
    shop_name,
    'owner',
    user_pin
  );
END;
$$;

-- Create a policy that allows users to call this function
-- Actually, we'll use the function directly from the client
-- But we still need a policy for direct inserts (for backwards compatibility)
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
