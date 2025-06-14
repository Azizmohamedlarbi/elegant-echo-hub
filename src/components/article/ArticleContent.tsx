
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
  return (
    <Card>
      {article.featured_image_url && (
        <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
          <img
            src={article.featured_image_url}
            alt={article.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="text-3xl font-bold mb-4">{article.title}</CardTitle>
        
        {article.excerpt && (
          <p className="text-lg text-gray-600 mb-4">{article.excerpt}</p>
        )}
        
        <ArticleMetadata
          author={article.profiles}
          publishedAt={article.published_at}
          likesCount={article._count.likes}
          isLiked={article.isLiked}
          onLike={onLike}
        />
      </CardHeader>
      
      <CardContent>
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: processMediaContent(article.content.replace(/\n/g, '<br />')) 
          }}
        />
      </CardContent>
    </Card>
  );
}
