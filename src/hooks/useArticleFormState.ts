
import { useState } from 'react';
import { generateSlug } from '@/utils/articleUtils';

export function useArticleFormState() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
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
    setStatus(data.status);
  };

  const getFormData = () => ({
    title: title.trim(),
    slug,
    excerpt,
    content: content.trim(),
    featuredImageUrl,
    status,
  });

  return {
    // State
    title,
    slug,
    excerpt,
    content,
    featuredImageUrl,
    status,
    loading,
    initialLoading,
    // Setters
    setSlug,
    setExcerpt,
    setContent,
    setFeaturedImageUrl,
    setStatus,
    setLoading,
    setInitialLoading,
    // Helpers
    handleTitleChange,
    populateForm,
    getFormData,
  };
}
