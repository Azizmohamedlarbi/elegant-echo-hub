
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { CommentSection } from '@/components/CommentSection';
import { loadInstagramScript } from '@/utils/mediaProcessor';
import { ArticleHeader } from '@/components/article/ArticleHeader';
import { ArticleLoading } from '@/components/article/ArticleLoading';
import { ArticleNotFound } from '@/components/article/ArticleNotFound';
import { ArticleContent } from '@/components/article/ArticleContent';

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

  // Load Instagram script when component mounts
  useEffect(() => {
    loadInstagramScript();
  }, []);

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

  if (loading) {
    return <ArticleLoading />;
  }

  if (!article) {
    return <ArticleNotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <ArticleHeader />
        <ArticleContent article={article} onLike={handleLike} />
        <CommentSection articleId={article.id} />
      </div>
    </div>
  );
}
