
import { supabase } from '@/integrations/supabase/client';
import { generateSlug } from '@/utils/articleUtils';

export interface ArticleData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImageUrl: string;
  isPremium: boolean;
  status: 'draft' | 'published' | 'archived';
  categoryIds?: string[];
  tags?: string[];
}

export const loadArticle = async (articleId: string, userId: string) => {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      article_categories (
        categories (*)
      ),
      article_tags (
        tags (*)
      )
    `)
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
  const { data: article, error } = await supabase
    .from('articles')
    .insert([{
      title: articleData.title,
      slug: articleData.slug || generateSlug(articleData.title),
      excerpt: articleData.excerpt.trim() || null,
      content: articleData.content,
      featured_image_url: articleData.featuredImageUrl.trim() || null,
      is_premium: articleData.isPremium,
      status: articleData.status,
      published_at: articleData.status === 'published' ? new Date().toISOString() : null,
      author_id: userId,
    }])
    .select()
    .single();

  if (error) throw error;

  // Handle categories
  if (articleData.categoryIds && articleData.categoryIds.length > 0) {
    const categoryInserts = articleData.categoryIds.map(categoryId => ({
      article_id: article.id,
      category_id: categoryId
    }));
    
    const { error: categoryError } = await supabase
      .from('article_categories')
      .insert(categoryInserts);
    
    if (categoryError) throw categoryError;
  }

  // Handle tags
  if (articleData.tags && articleData.tags.length > 0) {
    // Create or get existing tags
    for (const tagName of articleData.tags) {
      const { data: existingTag } = await supabase
        .from('tags')
        .select('id')
        .eq('name', tagName.toLowerCase())
        .single();

      let tagId = existingTag?.id;

      if (!tagId) {
        const { data: newTag, error: tagError } = await supabase
          .from('tags')
          .insert([{ 
            name: tagName.toLowerCase(),
            slug: generateSlug(tagName)
          }])
          .select('id')
          .single();
        
        if (tagError) throw tagError;
        tagId = newTag.id;
      }

      // Link tag to article
      const { error: linkError } = await supabase
        .from('article_tags')
        .insert([{
          article_id: article.id,
          tag_id: tagId
        }]);
      
      if (linkError) throw linkError;
    }
  }

  return article;
};

export const updateArticle = async (articleId: string, articleData: ArticleData, userId: string) => {
  const { error } = await supabase
    .from('articles')
    .update({
      title: articleData.title,
      slug: articleData.slug || generateSlug(articleData.title),
      excerpt: articleData.excerpt.trim() || null,
      content: articleData.content,
      featured_image_url: articleData.featuredImageUrl.trim() || null,
      is_premium: articleData.isPremium,
      status: articleData.status,
      published_at: articleData.status === 'published' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', articleId)
    .eq('author_id', userId);

  if (error) throw error;

  // Update categories - remove existing and add new ones
  await supabase
    .from('article_categories')
    .delete()
    .eq('article_id', articleId);

  if (articleData.categoryIds && articleData.categoryIds.length > 0) {
    const categoryInserts = articleData.categoryIds.map(categoryId => ({
      article_id: articleId,
      category_id: categoryId
    }));
    
    const { error: categoryError } = await supabase
      .from('article_categories')
      .insert(categoryInserts);
    
    if (categoryError) throw categoryError;
  }

  // Update tags - remove existing and add new ones
  await supabase
    .from('article_tags')
    .delete()
    .eq('article_id', articleId);

  if (articleData.tags && articleData.tags.length > 0) {
    for (const tagName of articleData.tags) {
      const { data: existingTag } = await supabase
        .from('tags')
        .select('id')
        .eq('name', tagName.toLowerCase())
        .single();

      let tagId = existingTag?.id;

      if (!tagId) {
        const { data: newTag, error: tagError } = await supabase
          .from('tags')
          .insert([{ 
            name: tagName.toLowerCase(),
            slug: generateSlug(tagName)
          }])
          .select('id')
          .single();
        
        if (tagError) throw tagError;
        tagId = newTag.id;
      }

      const { error: linkError } = await supabase
        .from('article_tags')
        .insert([{
          article_id: articleId,
          tag_id: tagId
        }]);
      
      if (linkError) throw linkError;
    }
  }
};

export const fetchCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
};

export const createCategory = async (name: string, description?: string) => {
  const { data, error } = await supabase
    .from('categories')
    .insert([{
      name,
      slug: generateSlug(name),
      description
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};
