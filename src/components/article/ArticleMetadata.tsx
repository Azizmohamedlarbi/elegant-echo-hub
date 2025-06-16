
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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 mb-3 sm:mb-4 gap-3 sm:gap-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-1">
          <User className="h-4 w-4" />
          <span className="truncate">{author?.full_name || author?.username}</span>
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
        className={`${isLiked ? 'text-red-500 hover:text-red-600' : ''} self-start sm:self-auto`}
      >
        <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
        {likesCount}
      </Button>
    </div>
  );
}
