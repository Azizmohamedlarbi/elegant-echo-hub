
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
    <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
      <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
        <div className="flex items-center space-x-1">
          <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="truncate font-medium">{author?.full_name || author?.username}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="whitespace-nowrap">{format(new Date(publishedAt), 'MMMM d, yyyy')}</span>
        </div>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onLike}
        className={`${isLiked ? 'text-red-500 hover:text-red-600 border-red-200 hover:border-red-300' : ''} self-start sm:self-auto text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 h-auto`}
      >
        <Heart className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
        <span>{likesCount}</span>
      </Button>
    </div>
  );
}
