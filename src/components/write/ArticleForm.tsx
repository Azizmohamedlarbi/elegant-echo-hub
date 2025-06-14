
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArticleMetadata } from './ArticleMetadata';
import { ArticleContent } from './ArticleContent';
import { ArticleActions } from './ArticleActions';
import { ArticleFormLoading } from './ArticleFormLoading';
import { useArticleForm } from '@/hooks/useArticleForm';

interface ArticleFormProps {
  articleId?: string;
}

export function ArticleForm({ articleId }: ArticleFormProps) {
  const {
    title,
    slug,
    excerpt,
    content,
    featuredImageUrl,
    status,
    loading,
    initialLoading,
    handleTitleChange,
    setSlug,
    setExcerpt,
    setContent,
    setFeaturedImageUrl,
    setStatus,
    handleSubmit,
    handleCancel,
  } = useArticleForm(articleId);

  if (initialLoading) {
    return <ArticleFormLoading />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{articleId ? 'Edit Article' : 'Article Details'}</CardTitle>
        <CardDescription>
          {articleId ? 'Update your article information below' : 'Fill in the information below to create your article'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <ArticleMetadata
            title={title}
            slug={slug}
            excerpt={excerpt}
            featuredImageUrl={featuredImageUrl}
            onTitleChange={handleTitleChange}
            onSlugChange={setSlug}
            onExcerptChange={setExcerpt}
            onFeaturedImageUrlChange={setFeaturedImageUrl}
          />

          <ArticleContent
            content={content}
            onContentChange={setContent}
          />

          <ArticleActions
            status={status}
            loading={loading}
            onStatusChange={setStatus}
            onCancel={handleCancel}
          />
        </form>
      </CardContent>
    </Card>
  );
}
