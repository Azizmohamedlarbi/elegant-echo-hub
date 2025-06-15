
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useArticleFormState } from './useArticleFormState';
import { loadArticle, createArticle, updateArticle } from '@/services/articleService';
import { validateArticleForm } from '@/utils/articleUtils';

export function useArticleForm(articleId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const formState = useArticleFormState();

  // Set initial loading state if in edit mode
  useEffect(() => {
    if (articleId) {
      formState.setInitialLoading(true);
      loadArticleData();
    }
  }, [articleId]);

  const loadArticleData = async () => {
    if (!articleId || !user) return;

    try {
      const data = await loadArticle(articleId, user.id);
      formState.populateForm(data);
    } catch (error) {
      console.error('Error loading article:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load article data',
        variant: 'destructive',
      });
      navigate('/dashboard');
    } finally {
      formState.setInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = formState.getFormData();
    const validationError = validateArticleForm(formData.title, formData.content);
    
    if (validationError) {
      toast({
        title: 'Error',
        description: validationError,
        variant: 'destructive',
      });
      return;
    }

    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save an article',
        variant: 'destructive',
      });
      return;
    }

    formState.setLoading(true);

    try {
      if (articleId) {
        await updateArticle(articleId, formData, user.id);
        toast({
          title: 'Success',
          description: `Article ${formData.status === 'published' ? 'updated and published' : 'updated'} successfully`,
        });
      } else {
        await createArticle(formData, user.id);
        toast({
          title: 'Success',
          description: `Article ${formData.status === 'published' ? 'published' : 'saved as draft'} successfully`,
        });
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving article:', error);
      toast({
        title: 'Error',
        description: `Failed to ${articleId ? 'update' : 'create'} article`,
        variant: 'destructive',
      });
    } finally {
      formState.setLoading(false);
    }
  };

  return {
    // State from formState
    title: formState.title,
    slug: formState.slug,
    excerpt: formState.excerpt,
    content: formState.content,
    featuredImageUrl: formState.featuredImageUrl,
    categoryIds: formState.categoryIds,
    tags: formState.tags,
    status: formState.status,
    loading: formState.loading,
    initialLoading: formState.initialLoading,
    // Handlers
    handleTitleChange: (value: string) => formState.handleTitleChange(value, articleId),
    setSlug: formState.setSlug,
    setExcerpt: formState.setExcerpt,
    setContent: formState.setContent,
    setFeaturedImageUrl: formState.setFeaturedImageUrl,
    setCategoryIds: formState.setCategoryIds,
    setTags: formState.setTags,
    setStatus: formState.setStatus,
    handleSubmit,
    handleCancel: () => navigate('/dashboard'),
  };
}
