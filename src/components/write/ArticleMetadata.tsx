
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Lock, Crown } from 'lucide-react';
import { CategorySelector } from './CategorySelector';
import { TagsInput } from './TagsInput';

interface ArticleMetadataProps {
  title: string;
  slug: string;
  excerpt: string;
  featuredImageUrl: string;
  categoryIds: string[];
  tags: string[];
  isPremium: boolean;
  onTitleChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onExcerptChange: (value: string) => void;
  onFeaturedImageUrlChange: (value: string) => void;
  onCategoryIdsChange: (categoryIds: string[]) => void;
  onTagsChange: (tags: string[]) => void;
  onIsPremiumChange: (isPremium: boolean) => void;
}

export function ArticleMetadata({
  title,
  slug,
  excerpt,
  featuredImageUrl,
  categoryIds,
  tags,
  isPremium,
  onTitleChange,
  onSlugChange,
  onExcerptChange,
  onFeaturedImageUrlChange,
  onCategoryIdsChange,
  onTagsChange,
  onIsPremiumChange,
}: ArticleMetadataProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter article title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">URL Slug</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
          placeholder="article-url-slug"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => onExcerptChange(e.target.value)}
          placeholder="Brief description of the article"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="featured-image">Featured Image URL</Label>
        <Input
          id="featured-image"
          type="url"
          value={featuredImageUrl}
          onChange={(e) => onFeaturedImageUrlChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-center space-x-3">
            {isPremium ? (
              <Crown className="h-5 w-5 text-yellow-600" />
            ) : (
              <Lock className="h-5 w-5 text-gray-400" />
            )}
            <div>
              <Label htmlFor="premium-toggle" className="text-sm font-medium">
                Premium Article
              </Label>
              <p className="text-xs text-gray-600">
                {isPremium 
                  ? "This article requires authentication to read in full" 
                  : "This article is free to read by everyone"
                }
              </p>
            </div>
          </div>
          <Switch
            id="premium-toggle"
            checked={isPremium}
            onCheckedChange={onIsPremiumChange}
          />
        </div>
      </div>

      <CategorySelector
        selectedCategoryIds={categoryIds}
        onCategoryIdsChange={onCategoryIdsChange}
      />

      <TagsInput
        tags={tags}
        onTagsChange={onTagsChange}
      />
    </div>
  );
}
