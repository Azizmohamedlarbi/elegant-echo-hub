
import { Button } from '@/components/ui/button';
import { Calendar, User, Heart } from 'lucide-react';
import { format } from 'date-fns';

interface ArticleMetadataProps {
  author: {
    full_name: string;
    username: string;
  };
  publishedAt: string;
  likesCount: number;
  isLiked: boolean;
  onLike: () => void;
}

export function ArticleMetadata({ 
  author, 
  publishedAt, 
  likesCount, 
  isLiked, 
  onLike 
}: ArticleMetadataProps) {
  return (
    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <User className="h-4 w-4" />
          <span>{author?.full_name || author?.username}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(publishedAt), 'MMMM d, yyyy')}</span>
        </div>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onLike}
        className={isLiked ? 'text-red-500 hover:text-red-600' : ''}
      >
        <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
        {likesCount}
      </Button>
    </div>
  );
}
