
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Eye, MessageCircle, Heart, Calendar } from 'lucide-react';
import { format, subDays, startOfDay } from 'date-fns';

interface AnalyticsData {
  totalArticles: number;
  totalLikes: number;
  totalComments: number;
  publishedArticles: number;
  draftArticles: number;
  articlesThisWeek: number;
  topArticles: Array<{
    title: string;
    likes: number;
    comments: number;
  }>;
  dailyActivity: Array<{
    date: string;
    articles: number;
    likes: number;
    comments: number;
  }>;
}

export function AnalyticsOverview() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch basic counts
      const [
        articlesResult,
        likesResult,
        commentsResult,
        publishedResult,
        draftResult,
        recentArticlesResult
      ] = await Promise.all([
        supabase.from('articles').select('*', { count: 'exact', head: true }),
        supabase.from('likes').select('*', { count: 'exact', head: true }),
        supabase.from('comments').select('*', { count: 'exact', head: true }),
        supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
        supabase.from('articles').select('*', { count: 'exact', head: true }).gte('created_at', startOfDay(subDays(new Date(), 7)).toISOString())
      ]);

      // Fetch top articles with engagement
      const { data: topArticlesData } = await supabase
        .from('articles')
        .select(`
          title,
          likes:likes(count),
          comments:comments(count)
        `)
        .eq('status', 'published')
        .limit(5);

      // Create daily activity data for the last 7 days
      const dailyActivity = [];
      for (let i = 6; i >= 0; i--) {
        const date = startOfDay(subDays(new Date(), i));
        const dateStr = date.toISOString();
        
        const [articlesCount, likesCount, commentsCount] = await Promise.all([
          supabase
            .from('articles')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', dateStr)
            .lt('created_at', startOfDay(subDays(new Date(), i - 1)).toISOString()),
          supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', dateStr)
            .lt('created_at', startOfDay(subDays(new Date(), i - 1)).toISOString()),
          supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', dateStr)
            .lt('created_at', startOfDay(subDays(new Date(), i - 1)).toISOString())
        ]);

        dailyActivity.push({
          date: format(date, 'MMM dd'),
          articles: articlesCount.count || 0,
          likes: likesCount.count || 0,
          comments: commentsCount.count || 0,
        });
      }

      setAnalytics({
        totalArticles: articlesResult.count || 0,
        totalLikes: likesResult.count || 0,
        totalComments: commentsResult.count || 0,
        publishedArticles: publishedResult.count || 0,
        draftArticles: draftResult.count || 0,
        articlesThisWeek: recentArticlesResult.count || 0,
        topArticles: topArticlesData?.map(article => ({
          title: article.title.length > 30 ? article.title.substring(0, 30) + '...' : article.title,
          likes: Array.isArray(article.likes) ? article.likes.length : 0,
          comments: Array.isArray(article.comments) ? article.comments.length : 0,
        })) || [],
        dailyActivity,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics) return null;

  const statusData = [
    { name: 'Published', value: analytics.publishedArticles, color: '#10b981' },
    { name: 'Draft', value: analytics.draftArticles, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalArticles}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.articlesThisWeek} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalLikes}</div>
            <p className="text-xs text-muted-foreground">
              Across all articles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalComments}</div>
            <p className="text-xs text-muted-foreground">
              User engagement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.publishedArticles}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.draftArticles} drafts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Activity (Last 7 Days)</CardTitle>
            <CardDescription>Articles, likes, and comments by day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="articles" stroke="#3b82f6" name="Articles" />
                <Line type="monotone" dataKey="likes" stroke="#10b981" name="Likes" />
                <Line type="monotone" dataKey="comments" stroke="#f59e0b" name="Comments" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Article Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Article Status</CardTitle>
            <CardDescription>Distribution of published vs draft articles</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {statusData.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-sm">{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Top Articles by Engagement</CardTitle>
          <CardDescription>Articles with the most likes and comments</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.topArticles}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="likes" fill="#10b981" name="Likes" />
              <Bar dataKey="comments" fill="#f59e0b" name="Comments" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
