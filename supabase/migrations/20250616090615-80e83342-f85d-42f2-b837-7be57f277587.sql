
-- Add a premium field to articles table to distinguish between free and premium content
ALTER TABLE public.articles 
ADD COLUMN is_premium BOOLEAN NOT NULL DEFAULT false;

-- Add a comment to explain the field
COMMENT ON COLUMN public.articles.is_premium IS 'Whether this article requires authentication to read in full';
