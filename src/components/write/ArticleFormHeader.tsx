
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ArticleFormHeaderProps {
  articleId?: string;
}

export function ArticleFormHeader({ articleId }: ArticleFormHeaderProps) {
  return (
    <CardHeader>
      <CardTitle>{articleId ? 'Edit Article' : 'Article Details'}</CardTitle>
      <CardDescription>
        {articleId ? 'Update your article information below' : 'Fill in the information below to create your article'}
      </CardDescription>
    </CardHeader>
  );
}
