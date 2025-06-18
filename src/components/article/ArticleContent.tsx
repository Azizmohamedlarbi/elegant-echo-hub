
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArticleMetadata } from './ArticleMetadata';
import { processMediaContent } from '@/utils/mediaProcessor';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  published_at: string;
  featured_image_url: string;
  is_premium: boolean;
  profiles: {
    full_name: string;
    username: string;
  };
  _count: {
    likes: number;
  };
  isLiked: boolean;
}

interface ArticleContentProps {
  article: Article;
  onLike: () => void;
  showFullContent?: boolean;
}

export function ArticleContent({ article, onLike, showFullContent = true }: ArticleContentProps) {
  const renderFeaturedMedia = () => {
    if (!article.featured_image_url) return null;

    // Process the featured media URL through our media processor
    const processedMedia = processMediaContent(article.featured_image_url);
    
    return (
      <div 
        className="mb-4 sm:mb-6 overflow-hidden rounded-lg"
        dangerouslySetInnerHTML={{ __html: processedMedia }}
      />
    );
  };

  const getContentToShow = () => {
    if (showFullContent) {
      return article.content;
    }

    // For premium articles shown to non-authenticated users, show a preview
    const words = article.content.replace(/<[^>]*>/g, ' ').split(' ');
    const previewWords = words.slice(0, 100); // Show first 100 words
    return previewWords.join(' ') + (words.length > 100 ? '...' : '');
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4 gap-3">
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight flex-1 break-words">
            {article.title}
          </CardTitle>
          {article.is_premium && (
            <div className="flex-shrink-0 self-start">
              <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Premium
              </span>
            </div>
          )}
        </div>
        
        {article.excerpt && (
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-3 sm:mb-4 leading-relaxed break-words">
            {article.excerpt}
          </p>
        )}
        
        <ArticleMetadata
          author={article.profiles}
          publishedAt={article.published_at}
          likesCount={article._count.likes}
          isLiked={article.isLiked}
          onLike={onLike}
        />
      </CardHeader>
      
      <CardContent className="p-4 sm:p-6">
        {renderFeaturedMedia()}
        
        <div className="relative">
          <div 
            className={`prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-headings:leading-tight prose-p:leading-relaxed prose-img:rounded-lg prose-img:shadow-md break-words ${
              !showFullContent ? 'relative' : ''
            }`}
            dangerouslySetInnerHTML={{ 
              __html: processMediaContent(getContentToShow()) 
            }}
          />
          {!showFullContent && (
            <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
