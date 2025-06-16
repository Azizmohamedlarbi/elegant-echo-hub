
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, User, Heart, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
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

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    fetchArticlesAndCategories();
  }, []);

  useEffect(() => {
    filterAndSortArticles();
  }, [articles, searchTerm, selectedCategory, selectedTag, sortBy]);

  const fetchArticlesAndCategories = async () => {
    try {
      // Fetch articles with categories and tags
      const { data: articlesData, error: articlesError } = await supabase
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
        .order('published_at', { ascending: false });

      if (articlesError) throw articlesError;

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      // Transform articles data
      const transformedArticles = await Promise.all(
        (articlesData || []).map(async (article) => {
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

      setArticles(transformedArticles);
      setCategories(categoriesData || []);

      // Extract unique tags
      const allTags = transformedArticles.flatMap(article => 
        article.tags.map(tag => tag.name)
      );
      setAvailableTags([...new Set(allTags)].sort());

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortArticles = () => {
    let filtered = [...articles];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.categories.some(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        article.tags.some(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(article =>
        article.categories.some(cat => cat.id === selectedCategory)
      );
    }

    // Filter by tag
    if (selectedTag && selectedTag !== 'all') {
      filtered = filtered.filter(article =>
        article.tags.some(tag => tag.name === selectedTag)
      );
    }

    // Sort articles
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.published_at).getTime() - new Date(b.published_at).getTime();
        case 'popular':
          return b._count.likes - a._count.likes;
        case 'newest':
        default:
          return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
      }
    });

    setFilteredArticles(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedTag('all');
    setSortBy('newest');
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || selectedTag !== 'all' || sortBy !== 'newest';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-lg">Loading articles...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">All Articles</h1>
          
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search articles, categories, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Filters:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Tags" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tags</SelectItem>
                    {availableTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: 'newest' | 'oldest' | 'popular') => setSortBy(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button variant="outline" size="sm" onClick={clearFilters} className="w-full sm:w-auto">
                    <X className="h-4 w-4 mr-1" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="text-center text-gray-600 py-12 px-4">
            <p className="text-lg">
              {hasActiveFilters ? 'No articles found matching your criteria.' : 'No articles published yet.'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600 px-1">
              Showing {filteredArticles.length} of {articles.length} articles
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {filteredArticles.map((article) => {
                const thumbnailUrl = extractThumbnail(article.featured_image_url);
                
                return (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow group">
                    {thumbnailUrl && (
                      <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                        <img
                          src={thumbnailUrl}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <CardHeader className="p-4 sm:p-6">
                      <CardTitle className="line-clamp-2 text-lg sm:text-xl">
                        <Link
                          to={`/articles/${article.slug}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {article.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="line-clamp-3 text-sm">
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
                            {article.tags.map((tag) => (
                              <Badge key={tag.id} variant="outline" className="text-xs">
                                #{tag.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-500 gap-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="truncate">{article.profiles?.full_name || article.profiles?.username}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{format(new Date(article.published_at), 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 self-end sm:self-auto">
                          <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>{article._count.likes}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
