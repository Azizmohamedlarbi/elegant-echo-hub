
-- Create a table for dynamic page content
CREATE TABLE public.page_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

-- Create policy that allows everyone to read page content
CREATE POLICY "Everyone can view page content" 
  ON public.page_content 
  FOR SELECT 
  TO public;

-- Create policy that allows only admins to insert page content
CREATE POLICY "Only admins can create page content" 
  ON public.page_content 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Create policy that allows only admins to update page content
CREATE POLICY "Only admins can update page content" 
  ON public.page_content 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Insert default content for the About Me page
INSERT INTO public.page_content (page_key, title, content) 
VALUES (
  'about-me', 
  'À propos de moi', 
  'Bienvenue sur mon blog ! Je suis Aziz Mohamed Larbi Fillali, passionné par l''écriture et le partage de connaissances. Cette page peut être modifiée depuis le tableau de bord administrateur.'
);
