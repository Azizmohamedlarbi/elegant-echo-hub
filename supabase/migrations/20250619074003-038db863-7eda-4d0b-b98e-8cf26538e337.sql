
-- First, let's check if your user profile has admin rights
-- (This is just a diagnostic query, no changes)
SELECT id, full_name, username, is_admin 
FROM public.profiles 
WHERE id = auth.uid();

-- If the above shows you don't have is_admin = true, let's fix it
-- Replace 'your-email@example.com' with your actual email
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
WHERE email = 'armh605@gmail.com';

-- Also ensure your profile has admin status
UPDATE public.profiles 
SET is_admin = true 
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'armh605@gmail.com'
);

-- Let's also check if the is_admin function is working correctly
-- by testing it directly
SELECT public.is_admin() as am_i_admin;
