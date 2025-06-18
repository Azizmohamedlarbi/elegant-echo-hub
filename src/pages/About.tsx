
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface PageContent {
  id: string;
  page_key: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export default function About() {
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPageContent();
  }, []);

  const fetchPageContent = async () => {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_key', 'about-me')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching page content:', error);
      } else {
        setPageContent(data);
      }
    } catch (error) {
      console.error('Error fetching page content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              {pageContent?.title || 'À propos de moi'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
              <div 
                className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words"
                dangerouslySetInnerHTML={{ 
                  __html: pageContent?.content || 'Contenu non disponible.' 
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
