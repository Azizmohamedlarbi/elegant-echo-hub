
import { useAuth } from '@/hooks/useAuth';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { WriteHeader } from '@/components/write/WriteHeader';
import { ArticleForm } from '@/components/write/ArticleForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Write() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminStatus();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const editMode = id || searchParams.get('edit');

  if (authLoading || adminLoading) {
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Access Denied</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Only administrators can create and edit articles.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <WriteHeader
          title={editMode ? "Edit Article" : "Write New Article"}
          description={editMode ? "Update your blog content" : "Create and publish your blog content"}
        />
        <ArticleForm articleId={editMode} />
      </div>
    </div>
  );
}
