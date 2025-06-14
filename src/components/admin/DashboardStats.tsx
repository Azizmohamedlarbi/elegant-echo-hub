
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Heart, MessageCircle } from 'lucide-react';

interface Stats {
  totalArticles: number;
  publishedArticles: number;
  totalUsers: number;
  totalLikes: number;
  totalComments: number;
}

export const DashboardStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalArticles: 0,
    publishedArticles: 0,
    totalUsers: 0,
    totalLikes: 0,
    totalComments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get articles stats
        const { data: articlesData } = await supabase
          .from('articles')
          .select('status');

        const totalArticles = articlesData?.length || 0;
        const publishedArticles = articlesData?.filter(a => a.status === 'published').length || 0;

        // Get users count
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Get likes count
        const { count: likesCount } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true });

        // Get comments count
        const { count: commentsCount } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true });

        setStats({
          totalArticles,
          publishedArticles,
          totalUsers: usersCount || 0,
          totalLikes: likesCount || 0,
          totalComments: commentsCount || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Articles',
      value: stats.totalArticles,
      description: `${stats.publishedArticles} published`,
      icon: FileText,
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      description: 'Registered users',
      icon: Users,
    },
    {
      title: 'Total Likes',
      value: stats.totalLikes,
      description: 'Article likes',
      icon: Heart,
    },
    {
      title: 'Total Comments',
      value: stats.totalComments,
      description: 'User comments',
      icon: MessageCircle,
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
