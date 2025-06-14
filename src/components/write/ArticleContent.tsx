
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';
import { RichTextEditor } from '@/components/RichTextEditor';

interface ArticleContentProps {
  content: string;
  onContentChange: (value: string) => void;
}

export function ArticleContent({ content, onContentChange }: ArticleContentProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="content">Content *</Label>
      <div className="mb-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-2">Rich Text Editor & Media Embedding:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Use the toolbar above to format your text with headings, bold, italic, lists, and more</li>
              <li><strong>YouTube:</strong> Paste YouTube video URLs directly (youtube.com/watch?v= or youtu.be/)</li>
              <li><strong>Google Drive:</strong> Share videos/images and paste the sharing link</li>
              <li><strong>Instagram:</strong> Paste Instagram post URLs (instagram.com/p/ or /reel/)</li>
              <li><strong>Facebook:</strong> Paste Facebook video URLs</li>
              <li><strong>Images:</strong> Paste direct image URLs (.jpg, .png, .gif, etc.)</li>
            </ul>
            <p className="mt-2 text-xs">All media will be embedded natively in your blog without showing the source.</p>
          </div>
        </div>
      </div>
      <RichTextEditor
        value={content}
        onChange={onContentChange}
        placeholder="Write your article content here... Use the toolbar above to format your text and paste media URLs directly for automatic embedding."
        rows={15}
      />
    </div>
  );
}
