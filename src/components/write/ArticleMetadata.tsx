
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';
import { fetchCategories } from '@/services/articleService';

interface ArticleMetadataProps {
  title: string;
  slug: string;
  excerpt: string;
  featuredImageUrl: string;
  categoryIds: string[];
  tags: string[];
  onTitleChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onExcerptChange: (value: string) => void;
  onFeaturedImageUrlChange: (value: string) => void;
  onCategoryIdsChange: (categoryIds: string[]) => void;
  onTagsChange: (tags: string[]) => void;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

export function ArticleMetadata({
  title,
  slug,
  excerpt,
  featuredImageUrl,
  categoryIds,
  tags,
  onTitleChange,
  onSlugChange,
  onExcerptChange,
  onFeaturedImageUrlChange,
  onCategoryIdsChange,
  onTagsChange,
}: ArticleMetadataProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId && !categoryIds.includes(categoryId)) {
      onCategoryIdsChange([...categoryIds, categoryId]);
    }
  };

  const removeCategoryId = (categoryId: string) => {
    onCategoryIdsChange(categoryIds.filter(id => id !== categoryId));
  };

  const addTag = () => {
    const trimmedTag = newTag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onTagsChange([...tags, trimmedTag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const selectedCategories = categories.filter(cat => categoryIds.includes(cat.id));

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
        <Label htmlFor="featured-media">Featured Media URL</Label>
        <Input
          id="featured-media"
          value={featuredImageUrl}
          onChange={(e) => onFeaturedImageUrlChange(e.target.value)}
          placeholder="YouTube, Google Drive, or direct image URL (https://example.com/image.jpg)"
          type="url"
        />
        <p className="text-xs text-gray-500 mt-1">
          ✨ Supports: YouTube videos, Google Drive videos/images, direct image URLs - all display natively!
        </p>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <Label>Categories</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedCategories.map((category) => (
            <Badge
              key={category.id}
              variant="secondary"
              className="flex items-center gap-1"
              style={{ backgroundColor: category.color + '20', color: category.color }}
            >
              {category.name}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeCategoryId(category.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
        <Select onValueChange={handleCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Add a category..." />
          </SelectTrigger>
          <SelectContent>
            {categories
              .filter(cat => !categoryIds.includes(cat.id))
              .map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </div>
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="flex items-center gap-1">
              #{tag}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeTag(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleTagKeyPress}
            placeholder="Add a tag..."
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={addTag}
            disabled={!newTag.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          Press Enter or click + to add tags. Tags help readers discover your content.
        </p>
      </div>
    </>
  );
}
