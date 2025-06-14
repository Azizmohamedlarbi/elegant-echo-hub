
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function ArticleHeader() {
  return (
    <div className="mb-6">
      <Link to="/articles">
        <Button variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Articles
        </Button>
      </Link>
    </div>
  );
}
