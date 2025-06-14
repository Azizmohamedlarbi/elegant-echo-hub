
import { Card, CardContent } from '@/components/ui/card';

export function ArticleFormLoading() {
  return (
    <Card>
      <CardContent className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading article...</p>
        </div>
      </CardContent>
    </Card>
  );
}
