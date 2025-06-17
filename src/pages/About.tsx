
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">
              {pageContent?.title || 'À propos de moi'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <div 
                className="text-gray-700 leading-relaxed whitespace-pre-wrap"
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
