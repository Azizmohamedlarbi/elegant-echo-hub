
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { WriteHeader } from '@/components/write/WriteHeader';
import { ArticleForm } from '@/components/write/ArticleForm';

export default function Write() {
  const { user, loading: authLoading } = useAuth();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WriteHeader
          title="Write New Article"
          description="Create and publish your blog content"
        />
        <ArticleForm />
      </div>
    </div>
  );
}
