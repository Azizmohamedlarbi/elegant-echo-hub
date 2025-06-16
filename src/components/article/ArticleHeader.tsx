
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function ArticleHeader() {
  return (
    <div className="mb-4 sm:mb-6">
      <Link to="/articles">
        <Button variant="outline" size="sm" className="text-sm">
          <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4" />
          <span className="hidden xs:inline">Back to Articles</span>
          <span className="xs:hidden">Back</span>
        </Button>
      </Link>
    </div>
  );
}
