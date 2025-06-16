
import { useState } from 'react';
import { generateSlug } from '@/utils/articleUtils';

export function useArticleFormState() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const handleTitleChange = (value: string, articleId?: string) => {
    setTitle(value);
    // Only auto-generate slug for new articles or if slug matches the old title
    if (!articleId || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
  };

  const populateForm = (data: any) => {
    setTitle(data.title);
    setSlug(data.slug);
    setExcerpt(data.excerpt || '');
    setContent(data.content);
    setFeaturedImageUrl(data.featured_image_url || '');
    setIsPremium(data.is_premium || false);
    setStatus(data.status);
    
    // Populate categories
    const articleCategories = data.article_categories?.map((ac: any) => ac.categories?.id).filter(Boolean) || [];
    setCategoryIds(articleCategories);
    
    // Populate tags
    const articleTags = data.article_tags?.map((at: any) => at.tags?.name).filter(Boolean) || [];
    setTags(articleTags);
  };

  const getFormData = () => ({
    title: title.trim(),
    slug,
    excerpt,
    content: content.trim(),
    featuredImageUrl,
    isPremium,
    status,
    categoryIds,
    tags,
  });

  return {
    // State
    title,
    slug,
    excerpt,
    content,
    featuredImageUrl,
    categoryIds,
    tags,
    isPremium,
    status,
    loading,
    initialLoading,
    // Setters
    setSlug,
    setExcerpt,
    setContent,
    setFeaturedImageUrl,
    setCategoryIds,
    setTags,
    setIsPremium,
    setStatus,
    setLoading,
    setInitialLoading,
    // Helpers
    handleTitleChange,
    populateForm,
    getFormData,
  };
}
