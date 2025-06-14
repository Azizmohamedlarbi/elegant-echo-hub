
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function Write() {
  const { user, loading: authLoading } = useAuth();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Write New Article</h1>
          <p className="text-gray-600 mt-2">Create and publish your blog content</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Article Details</CardTitle>
            <CardDescription>Fill in the information below to create your article</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter article title..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="url-friendly-slug"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief description of your article..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="featured-image">Featured Image URL</Label>
                <Input
                  id="featured-image"
                  value={featuredImageUrl}
                  onChange={(e) => setFeaturedImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  type="url"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your article content here..."
                  rows={15}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value: 'draft' | 'published') => setStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Save as Draft</SelectItem>
                    <SelectItem value="published">Publish Now</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {status === 'published' ? 'Publish Article' : 'Save Draft'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
