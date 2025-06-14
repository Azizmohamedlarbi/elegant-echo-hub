
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Bold, 
  Italic, 
  Underline, 
  Heading1, 
  Heading2, 
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  Type
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

interface ToolbarButton {
  icon: JSX.Element;
  tooltip: string;
  action: () => void;
}

export function RichTextEditor({ value, onChange, placeholder, rows = 15 }: RichTextEditorProps) {
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null);

  const insertText = (before: string, after: string = '') => {
    if (!textareaRef) return;

    const start = textareaRef.selectionStart;
    const end = textareaRef.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);
    
    // Focus back on textarea and set cursor position
    setTimeout(() => {
      textareaRef.focus();
      const newCursorPos = start + before.length + selectedText.length + after.length;
      textareaRef.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertAtNewLine = (text: string) => {
    if (!textareaRef) return;

    const start = textareaRef.selectionStart;
    const beforeCursor = value.substring(0, start);
    const afterCursor = value.substring(start);
    
    // Check if we're at the beginning of a line
    const isAtLineStart = start === 0 || beforeCursor.endsWith('\n');
    const prefix = isAtLineStart ? '' : '\n';
    
    const newText = beforeCursor + prefix + text + afterCursor;
    onChange(newText);
    
    setTimeout(() => {
      textareaRef.focus();
      const newCursorPos = start + prefix.length + text.length;
      textareaRef.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const toolbarButtons: (ToolbarButton | 'separator')[] = [
    {
      icon: <Bold className="h-4 w-4" />,
      tooltip: 'Bold',
      action: () => insertText('**', '**'),
    },
    {
      icon: <Italic className="h-4 w-4" />,
      tooltip: 'Italic',
      action: () => insertText('*', '*'),
    },
    {
      icon: <Underline className="h-4 w-4" />,
      tooltip: 'Underline',
      action: () => insertText('<u>', '</u>'),
    },
    'separator',
    {
      icon: <Heading1 className="h-4 w-4" />,
      tooltip: 'Heading 1',
      action: () => insertAtNewLine('# '),
    },
    {
      icon: <Heading2 className="h-4 w-4" />,
      tooltip: 'Heading 2',
      action: () => insertAtNewLine('## '),
    },
    {
      icon: <Heading3 className="h-4 w-4" />,
      tooltip: 'Heading 3',
      action: () => insertAtNewLine('### '),
    },
    'separator',
    {
      icon: <List className="h-4 w-4" />,
      tooltip: 'Bullet List',
      action: () => insertAtNewLine('- '),
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      tooltip: 'Numbered List',
      action: () => insertAtNewLine('1. '),
    },
    {
      icon: <Quote className="h-4 w-4" />,
      tooltip: 'Quote',
      action: () => insertAtNewLine('> '),
    },
    'separator',
    {
      icon: <Link className="h-4 w-4" />,
      tooltip: 'Link',
      action: () => insertText('[Link Text](https://example.com)'),
    },
    {
      icon: <Image className="h-4 w-4" />,
      tooltip: 'Image',
      action: () => insertText('![Alt Text](https://example.com/image.jpg)'),
    },
  ];

  return (
    <div className="border rounded-lg">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
        <div className="flex items-center gap-1 text-sm text-gray-600 mr-4">
          <Type className="h-4 w-4" />
          <span>Format:</span>
        </div>
        {toolbarButtons.map((button, index) => 
          button === 'separator' ? (
            <Separator key={index} orientation="vertical" className="h-6" />
          ) : (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={button.action}
              title={button.tooltip}
              className="h-8 w-8 p-0"
            >
              {button.icon}
            </Button>
          )
        )}
      </div>
      
      {/* Text Area */}
      <Textarea
        ref={setTextareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="border-0 focus-visible:ring-0 resize-none"
      />
      
      {/* Help Text */}
      <div className="p-3 border-t bg-gray-50 text-xs text-gray-600">
        <p><strong>Formatting Tips:</strong></p>
        <p>• Use **bold** or *italic* for emphasis</p>
        <p>• Start lines with # for headings (# H1, ## H2, ### H3)</p>
        <p>• Paste YouTube, Instagram, or image URLs directly - they'll be embedded automatically</p>
      </div>
    </div>
  );
}
