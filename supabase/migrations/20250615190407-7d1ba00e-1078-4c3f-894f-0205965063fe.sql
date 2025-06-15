
-- Create tags table
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create article_tags junction table
CREATE TABLE public.article_tags (
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- Add color column to categories table
ALTER TABLE public.categories ADD COLUMN color TEXT DEFAULT '#3B82F6';

-- Enable RLS on new tables
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;

-- Tags policies
CREATE POLICY "Tags are viewable by everyone" ON public.tags
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage tags" ON public.tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Article tags policies
CREATE POLICY "Article tags are viewable by everyone" ON public.article_tags
  FOR SELECT USING (true);

CREATE POLICY "Authors can manage their article tags" ON public.article_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.articles 
      WHERE id = article_id AND author_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_tags_name ON public.tags(name);
CREATE INDEX idx_article_tags_article ON public.article_tags(article_id);
CREATE INDEX idx_article_tags_tag ON public.article_tags(tag_id);
