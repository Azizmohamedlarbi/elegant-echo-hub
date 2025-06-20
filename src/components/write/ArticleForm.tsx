
import { ArticleFormLoading } from './ArticleFormLoading';
import { ArticleFormCard } from './ArticleFormCard';
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
    categoryIds,
    tags,
    isPremium,
    status,
    loading,
    initialLoading,
    handleTitleChange,
    setSlug,
    setExcerpt,
    setContent,
    setFeaturedImageUrl,
    setCategoryIds,
    setTags,
    setIsPremium,
    setStatus,
    handleSubmit,
    handleCancel,
  } = useArticleForm(articleId);

  if (initialLoading) {
    return <ArticleFormLoading />;
  }

  return (
    <ArticleFormCard
      articleId={articleId}
      title={title}
      slug={slug}
      excerpt={excerpt}
      content={content}
      featuredImageUrl={featuredImageUrl}
      categoryIds={categoryIds}
      tags={tags}
      isPremium={isPremium}
      status={status}
      loading={loading}
      onTitleChange={handleTitleChange}
      onSlugChange={setSlug}
      onExcerptChange={setExcerpt}
      onContentChange={setContent}
      onFeaturedImageUrlChange={setFeaturedImageUrl}
      onCategoryIdsChange={setCategoryIds}
      onTagsChange={setTags}
      onIsPremiumChange={setIsPremium}
      onStatusChange={setStatus}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}
