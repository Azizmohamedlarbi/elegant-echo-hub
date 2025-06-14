
import { supabase } from '@/integrations/supabase/client';
import { generateSlug } from '@/utils/articleUtils';

export interface ArticleData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImageUrl: string;
  status: 'draft' | 'published' | 'archived';
}

export const loadArticle = async (articleId: string, userId: string) => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', articleId)
    .eq('author_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Article not found or you do not have permission to edit it.');
    }
    throw error;
  }

  return data;
};

export const createArticle = async (articleData: ArticleData, userId: string) => {
  const { data, error } = await supabase
    .from('articles')
    .insert([{
      ...articleData,
      slug: articleData.slug || generateSlug(articleData.title),
      excerpt: articleData.excerpt.trim() || null,
      featured_image_url: articleData.featuredImageUrl.trim() || null,
      published_at: articleData.status === 'published' ? new Date().toISOString() : null,
      author_id: userId,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateArticle = async (articleId: string, articleData: ArticleData, userId: string) => {
  const { error } = await supabase
    .from('articles')
    .update({
      ...articleData,
      slug: articleData.slug || generateSlug(articleData.title),
      excerpt: articleData.excerpt.trim() || null,
      featured_image_url: articleData.featuredImageUrl.trim() || null,
      published_at: articleData.status === 'published' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', articleId)
    .eq('author_id', userId);

  if (error) throw error;
};
