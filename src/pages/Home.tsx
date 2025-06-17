
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { extractThumbnail } from '@/utils/thumbnailExtractor';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  published_at: string;
  featured_image_url: string;
  profiles: {
    full_name: string;
    username: string;
  };
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    color: string;
  }>;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  _count: {
    likes: number;
  };
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          excerpt,
          slug,
          published_at,
          featured_image_url,
          profiles (
            full_name,
            username
          ),
          article_categories (
            categories (
              id,
              name,
              slug,
              color
            )
          ),
          article_tags (
            tags (
              id,
              name,
              slug
            )
          )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(6);

      if (error) throw error;

      // Get likes count for each article and transform data
      const articlesWithLikes = await Promise.all(
        (data || []).map(async (article) => {
          const { count } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('article_id', article.id);

          return {
            ...article,
            categories: article.article_categories?.map(ac => ac.categories).filter(Boolean) || [],
            tags: article.article_tags?.map(at => at.tags).filter(Boolean) || [],
            _count: { likes: count || 0 }
          };
        })
      );

      setArticles(articlesWithLikes);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Bienvenue sur mon Blog
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Découvrez des idées, des histoires et des réflexions qui inspirent et informent
          </p>
          <Link
            to="/articles"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Explorer les Articles
          </Link>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Derniers Articles
          </h2>
          
          {articles.length === 0 ? (
            <div className="text-center text-gray-600">
              <p>Aucun article publié pour le moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => {
                const thumbnailUrl = extractThumbnail(article.featured_image_url);
                
                return (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow">
                    {thumbnailUrl && (
                      <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                        <img
                          src={thumbnailUrl}
                          alt={article.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="line-clamp-2">
                        <Link
                          to={`/articles/${article.slug}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {article.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="line-clamp-3">
                        {article.excerpt}
                      </CardDescription>
                      
                      {/* Categories and Tags */}
                      <div className="space-y-2">
                        {article.categories.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {article.categories.map((category) => (
                              <Badge
                                key={category.id}
                                variant="secondary"
                                className="text-xs"
                                style={{ backgroundColor: category.color + '20', color: category.color }}
                              >
                                {category.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        {article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {article.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag.id} variant="outline" className="text-xs">
                                #{tag.name}
                              </Badge>
                            ))}
                            {article.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs text-gray-500">
                                +{article.tags.length - 3} de plus
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{article.profiles?.full_name || article.profiles?.username}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(article.published_at), 'd MMM yyyy', { locale: fr })}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>{article._count.likes}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
