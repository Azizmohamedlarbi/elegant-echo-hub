
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArticleMetadata } from './ArticleMetadata';
import { ArticleContent } from './ArticleContent';
import { ArticleActions } from './ArticleActions';

export function ArticleForm() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === generateSlug(title)) {
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
        description: 'You must be logged in to create an article',
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
        author_id: user.id,
        published_at: status === 'published' ? new Date().toISOString() : null,
      };

      const { data, error } = await supabase
        .from('articles')
        .insert([articleData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Article ${status === 'published' ? 'published' : 'saved as draft'} successfully`,
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating article:', error);
      toast({
        title: 'Error',
        description: 'Failed to create article',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Article Details</CardTitle>
        <CardDescription>Fill in the information below to create your article</CardDescription>
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
