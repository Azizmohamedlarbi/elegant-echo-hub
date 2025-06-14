
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArticleMetadata } from './ArticleMetadata';
import { ArticleContent } from './ArticleContent';
import { ArticleActions } from './ArticleActions';

interface ArticleFormProps {
  articleId?: string;
}

export function ArticleForm({ articleId }: ArticleFormProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!articleId);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load existing article data if in edit mode
  useEffect(() => {
    if (articleId) {
      loadArticle();
    }
  }, [articleId]);

  const loadArticle = async () => {
    if (!articleId || !user) return;

    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .eq('author_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          toast({
            title: 'Article not found',
            description: 'The article you are trying to edit does not exist or you do not have permission to edit it.',
            variant: 'destructive',
          });
          navigate('/dashboard');
          return;
        }
        throw error;
      }

      // Populate form with existing data
      setTitle(data.title);
      setSlug(data.slug);
      setExcerpt(data.excerpt || '');
      setContent(data.content);
      setFeaturedImageUrl(data.featured_image_url || '');
      setStatus(data.status);
    } catch (error) {
      console.error('Error loading article:', error);
      toast({
        title: 'Error',
        description: 'Failed to load article data',
        variant: 'destructive',
      });
      navigate('/dashboard');
    } finally {
      setInitialLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    // Only auto-generate slug for new articles or if slug matches the old title
    if (!articleId || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: 'Error',
        description: 'Title and content are required',
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

    setLoading(true);

    try {
      const articleData = {
        title: title.trim(),
        slug: slug || generateSlug(title),
        excerpt: excerpt.trim() || null,
        content: content.trim(),
        featured_image_url: featuredImageUrl.trim() || null,
        status,
        published_at: status === 'published' ? new Date().toISOString() : null,
      };

      if (articleId) {
        // Update existing article
        const { error } = await supabase
          .from('articles')
          .update({
            ...articleData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', articleId)
          .eq('author_id', user.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: `Article ${status === 'published' ? 'updated and published' : 'updated'} successfully`,
        });
      } else {
        // Create new article
        const { data, error } = await supabase
          .from('articles')
          .insert([{
            ...articleData,
            author_id: user.id,
          }])
          .select()
          .single();

        if (error) throw error;

        toast({
          title: 'Success',
          description: `Article ${status === 'published' ? 'published' : 'saved as draft'} successfully`,
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
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading article...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{articleId ? 'Edit Article' : 'Article Details'}</CardTitle>
        <CardDescription>
          {articleId ? 'Update your article information below' : 'Fill in the information below to create your article'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <ArticleMetadata
            title={title}
            slug={slug}
            excerpt={excerpt}
            featuredImageUrl={featuredImageUrl}
            onTitleChange={handleTitleChange}
            onSlugChange={setSlug}
            onExcerptChange={setExcerpt}
            onFeaturedImageUrlChange={setFeaturedImageUrl}
          />

          <ArticleContent
            content={content}
            onContentChange={setContent}
          />

          <ArticleActions
            status={status}
            loading={loading}
            onStatusChange={setStatus}
            onCancel={() => navigate('/dashboard')}
          />
        </form>
      </CardContent>
    </Card>
  );
}
