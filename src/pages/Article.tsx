
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Heart, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  published_at: string;
  featured_image_url: string;
  profiles: {
    full_name: string;
    username: string;
  };
  _count: {
    likes: number;
  };
  isLiked: boolean;
}

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug, user]);

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          content,
          excerpt,
          published_at,
          featured_image_url,
          profiles (
            full_name,
            username
          )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;

      // Get likes count
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('article_id', data.id);

      // Check if current user liked this article
      let isLiked = false;
      if (user) {
        const { data: likeData } = await supabase
          .from('likes')
          .select('id')
          .eq('article_id', data.id)
          .eq('user_id', user.id)
          .single();
        
        isLiked = !!likeData;
      }

      setArticle({
        ...data,
        _count: { likes: count || 0 },
        isLiked
      });
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user || !article) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to like articles',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (article.isLiked) {
        // Remove like
        await supabase
          .from('likes')
          .delete()
          .eq('article_id', article.id)
          .eq('user_id', user.id);
        
        setArticle(prev => prev ? {
          ...prev,
          _count: { likes: prev._count.likes - 1 },
          isLiked: false
        } : null);
      } else {
        // Add like
        await supabase
          .from('likes')
          .insert([{ article_id: article.id, user_id: user.id }]);
        
        setArticle(prev => prev ? {
          ...prev,
          _count: { likes: prev._count.likes + 1 },
          isLiked: true
        } : null);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: 'Error',
        description: 'Failed to update like status',
        variant: 'destructive',
      });
    }
  };

  const processContent = (content: string) => {
    // Replace media URLs with embedded content
    let processedContent = content;

    // YouTube video embedding
    processedContent = processedContent.replace(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/g,
      '<div class="video-container my-6"><iframe width="100%" height="315" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe></div>'
    );

    // Google Drive video embedding
    processedContent = processedContent.replace(
      /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/g,
      '<div class="video-container my-6"><iframe width="100%" height="315" src="https://drive.google.com/file/d/$1/preview" frameborder="0" allowfullscreen></iframe></div>'
    );

    // Instagram post embedding
    processedContent = processedContent.replace(
      /https:\/\/(?:www\.)?instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/g,
      '<div class="instagram-container my-6"><blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/$1/" style="max-width:540px; margin:auto;"></blockquote></div>'
    );

    // Facebook video embedding
    processedContent = processedContent.replace(
      /https:\/\/(?:www\.)?facebook\.com\/.*\/videos\/([0-9]+)/g,
      '<div class="video-container my-6"><iframe width="100%" height="315" src="https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/facebook/videos/$1" frameborder="0" allowfullscreen></iframe></div>'
    );

    // Image embedding (for various sources including Google Drive images)
    processedContent = processedContent.replace(
      /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp))/gi,
      '<img src="$1" alt="Article image" class="w-full h-auto rounded-lg my-4" />'
    );

    // Google Drive image embedding
    processedContent = processedContent.replace(
      /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/g,
      '<img src="https://drive.google.com/uc?id=$1" alt="Article image" class="w-full h-auto rounded-lg my-4" />'
    );

    return processedContent;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading article...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/articles">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Articles
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/articles">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Articles
            </Button>
          </Link>
        </div>

        <Card>
          {article.featured_image_url && (
            <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
              <img
                src={article.featured_image_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <CardHeader>
            <CardTitle className="text-3xl font-bold mb-4">{article.title}</CardTitle>
            
            {article.excerpt && (
              <p className="text-lg text-gray-600 mb-4">{article.excerpt}</p>
            )}
            
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{article.profiles?.full_name || article.profiles?.username}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(article.published_at), 'MMMM d, yyyy')}</span>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLike}
                className={article.isLiked ? 'text-red-500 hover:text-red-600' : ''}
              >
                <Heart className={`h-4 w-4 mr-1 ${article.isLiked ? 'fill-current' : ''}`} />
                {article._count.likes}
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: processContent(article.content.replace(/\n/g, '<br />')) 
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Instagram embed script */}
      <script async src="//www.instagram.com/embed.js"></script>
    </div>
  );
}
