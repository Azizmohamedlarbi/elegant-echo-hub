
import { Card, CardContent } from '@/components/ui/card';
import { ArticleFormHeader } from './ArticleFormHeader';
import { ArticleMetadata } from './ArticleMetadata';
import { ArticleContent } from './ArticleContent';
import { ArticleActions } from './ArticleActions';

interface ArticleFormCardProps {
  articleId?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImageUrl: string;
  status: 'draft' | 'published' | 'archived';
  loading: boolean;
  onTitleChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onExcerptChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onFeaturedImageUrlChange: (value: string) => void;
  onStatusChange: (value: 'draft' | 'published' | 'archived') => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function ArticleFormCard({
  articleId,
  title,
  slug,
  excerpt,
  content,
  featuredImageUrl,
  status,
  loading,
  onTitleChange,
  onSlugChange,
  onExcerptChange,
  onContentChange,
  onFeaturedImageUrlChange,
  onStatusChange,
  onSubmit,
  onCancel,
}: ArticleFormCardProps) {
  return (
    <Card>
      <ArticleFormHeader articleId={articleId} />
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <ArticleMetadata
            title={title}
            slug={slug}
            excerpt={excerpt}
            featuredImageUrl={featuredImageUrl}
            onTitleChange={onTitleChange}
            onSlugChange={onSlugChange}
            onExcerptChange={onExcerptChange}
            onFeaturedImageUrlChange={onFeaturedImageUrlChange}
          />

          <ArticleContent
            content={content}
            onContentChange={onContentChange}
          />

          <ArticleActions
            status={status}
            loading={loading}
            onStatusChange={onStatusChange}
            onCancel={onCancel}
          />
        </form>
      </CardContent>
    </Card>
  );
}
