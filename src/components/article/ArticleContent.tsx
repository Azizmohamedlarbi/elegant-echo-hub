
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
}

export function ArticleContent({ article, onLike }: ArticleContentProps) {
  const renderFeaturedMedia = () => {
    if (!article.featured_image_url) return null;

    // Process the featured media URL through our media processor
    const processedMedia = processMediaContent(article.featured_image_url);
    
    return (
      <div 
        className="mb-4 sm:mb-6"
        dangerouslySetInnerHTML={{ __html: processedMedia }}
      />
    );
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 leading-tight">
          {article.title}
        </CardTitle>
        
        {article.excerpt && (
          <p className="text-base sm:text-lg text-gray-600 mb-3 sm:mb-4 leading-relaxed">
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
        
        <div 
          className="prose prose-sm sm:prose-lg max-w-none prose-headings:leading-tight prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{ 
            __html: processMediaContent(article.content) 
          }}
        />
      </CardContent>
    </Card>
  );
}
