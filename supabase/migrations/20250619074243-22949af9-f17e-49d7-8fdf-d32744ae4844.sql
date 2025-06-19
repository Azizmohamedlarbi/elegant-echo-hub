
-- D'abord, vérifions et corrigeons votre statut d'administrateur
UPDATE public.profiles 
SET is_admin = true 
WHERE id = (SELECT id FROM auth.users WHERE email = 'armh605@gmail.com');

-- Supprimons toutes les politiques existantes pour page_content
DROP POLICY IF EXISTS "Everyone can view page content" ON public.page_content;
DROP POLICY IF EXISTS "Only admins can create page content" ON public.page_content;
DROP POLICY IF EXISTS "Only admins can update page content" ON public.page_content;

-- Recréons une politique très permissive pour que vous puissiez voir le contenu
CREATE POLICY "Everyone can view page content" 
  ON public.page_content 
  FOR SELECT 
  TO public 
  USING (true);

-- Créons une politique qui vérifie directement votre email pour l'insertion
CREATE POLICY "Specific admin can create page content" 
  ON public.page_content 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND email = 'armh605@gmail.com'
    )
  );

-- Créons une politique qui vérifie directement votre email pour la mise à jour
CREATE POLICY "Specific admin can update page content" 
  ON public.page_content 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND email = 'armh605@gmail.com'
    )
  );

-- Créons également une politique de suppression au cas où
CREATE POLICY "Specific admin can delete page content" 
  ON public.page_content 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND email = 'armh605@gmail.com'
    )
  );

-- Vérifions que tout fonctionne
SELECT 
  id, 
  email,
  (SELECT is_admin FROM public.profiles WHERE id = auth.users.id) as is_admin_status
FROM auth.users 
WHERE email = 'armh605@gmail.com';
