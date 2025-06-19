
-- Drop existing policies
DROP POLICY IF EXISTS "Only admins can create page content" ON public.page_content;
DROP POLICY IF EXISTS "Only admins can update page content" ON public.page_content;

-- Create a security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Recreate policies using the security definer function
CREATE POLICY "Only admins can create page content" 
  ON public.page_content 
  FOR INSERT 
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update page content" 
  ON public.page_content 
  FOR UPDATE 
  USING (public.is_admin());
