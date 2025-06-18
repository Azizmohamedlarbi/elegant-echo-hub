
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navigate } from 'react-router-dom';
import { ArticleManagement } from '@/components/admin/ArticleManagement';
import { UserManagement } from '@/components/admin/UserManagement';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { AnalyticsOverview } from '@/components/admin/AnalyticsOverview';
import { PageContentManagement } from '@/components/admin/PageContentManagement';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data?.is_admin || false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      checkAdminStatus();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Accès refusé</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Vous n'avez pas l'autorisation d'accéder au tableau de bord administrateur.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tableau de bord administrateur</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Gérer le contenu de votre blog et les utilisateurs</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-5 min-w-max sm:min-w-0">
              <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 sm:px-3">Aperçu</TabsTrigger>
              <TabsTrigger value="articles" className="text-xs sm:text-sm px-2 sm:px-3">Articles</TabsTrigger>
              <TabsTrigger value="users" className="text-xs sm:text-sm px-2 sm:px-3">Utilisateurs</TabsTrigger>
              <TabsTrigger value="pages" className="text-xs sm:text-sm px-2 sm:px-3">Pages</TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs sm:text-sm px-2 sm:px-3">Analyses</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview">
            <DashboardStats />
          </TabsContent>

          <TabsContent value="articles">
            <ArticleManagement />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="pages">
            <PageContentManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsOverview />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
