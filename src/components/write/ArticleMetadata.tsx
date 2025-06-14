
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ArticleMetadataProps {
  title: string;
  slug: string;
  excerpt: string;
  featuredImageUrl: string;
  onTitleChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onExcerptChange: (value: string) => void;
  onFeaturedImageUrlChange: (value: string) => void;
}

export function ArticleMetadata({
  title,
  slug,
  excerpt,
  featuredImageUrl,
  onTitleChange,
  onSlugChange,
  onExcerptChange,
  onFeaturedImageUrlChange,
}: ArticleMetadataProps) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter article title..."
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">URL Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            placeholder="url-friendly-slug"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => onExcerptChange(e.target.value)}
          placeholder="Brief description of your article..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="featured-image">Featured Image URL</Label>
        <Input
          id="featured-image"
          value={featuredImageUrl}
          onChange={(e) => onFeaturedImageUrlChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          type="url"
        />
      </div>
    </>
  );
}
