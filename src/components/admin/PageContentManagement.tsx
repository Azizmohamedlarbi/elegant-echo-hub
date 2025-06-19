
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save, Edit, RefreshCw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PageContent {
  id: string;
  page_key: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export const PageContentManagement = () => {
  const [pageContents, setPageContents] = useState<PageContent[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPageContents();
  }, []);

  const fetchPageContents = async () => {
    console.log('Fetching page contents...');
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Page contents response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.log('No page contents found, creating default content...');
        await createDefaultContent();
        return;
      }

      setPageContents(data);
      console.log('Page contents loaded:', data);
    } catch (error: any) {
      console.error('Error fetching page contents:', error);
      setError(error.message || 'Erreur lors du chargement des contenus');
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les contenus de page',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultContent = async () => {
    try {
      console.log('Creating default content...');
      const { data, error } = await supabase
        .from('page_content')
        .insert({
          page_key: 'about-me',
          title: 'À propos de moi',
          content: 'Bienvenue sur mon blog ! Je suis Aziz Mohamed Larbi Fillali, passionné par l\'écriture et le partage de connaissances. Cette page peut être modifiée depuis le tableau de bord administrateur.'
        })
        .select()
        .single();

      console.log('Default content creation response:', { data, error });

      if (error) {
        console.error('Error creating default content:', error);
        throw error;
      }

      setPageContents([data]);
      toast({
        title: 'Succès',
        description: 'Contenu par défaut créé avec succès',
      });
    } catch (error: any) {
      console.error('Error creating default content:', error);
      setError(error.message || 'Erreur lors de la création du contenu par défaut');
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le contenu par défaut. Assurez-vous d\'avoir les permissions d\'administrateur.',
        variant: 'destructive',
      });
    }
  };

  const startEditing = (pageContent: PageContent) => {
    console.log('Starting to edit:', pageContent);
    setEditingId(pageContent.id);
    setEditForm({
      title: pageContent.title,
      content: pageContent.content,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ title: '', content: '' });
  };

  const savePageContent = async (id: string) => {
    console.log('Saving page content:', { id, editForm });
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('page_content')
        .update({
          title: editForm.title,
          content: editForm.content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      console.log('Save response:', { error });

      if (error) {
        console.error('Error saving content:', error);
        throw error;
      }

      await fetchPageContents();
      setEditingId(null);
      setEditForm({ title: '', content: '' });

      toast({
        title: 'Succès',
        description: 'Contenu de page mis à jour avec succès',
      });
    } catch (error: any) {
      console.error('Error updating page content:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le contenu. Assurez-vous d\'avoir les permissions d\'administrateur.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Pages</CardTitle>
          <CardDescription>Chargement des contenus...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          <span>Chargement en cours...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Pages</CardTitle>
          <CardDescription>Une erreur s'est produite</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          <Button 
            onClick={fetchPageContents} 
            className="mt-4"
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (pageContents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Pages</CardTitle>
          <CardDescription>Aucun contenu trouvé</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Aucun contenu de page n'a été trouvé. Cliquez sur le bouton ci-dessous pour créer le contenu par défaut.
            </AlertDescription>
          </Alert>
          <Button 
            onClick={createDefaultContent} 
            className="mt-4"
          >
            Créer le contenu par défaut
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Pages</CardTitle>
        <CardDescription>Gérer le contenu des pages statiques</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {pageContents.map((pageContent) => (
          <div key={pageContent.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg capitalize">
                  {pageContent.page_key.replace('-', ' ')}
                </h3>
                <p className="text-sm text-gray-500">
                  Dernière mise à jour: {new Date(pageContent.updated_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
              {editingId !== pageContent.id && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEditing(pageContent)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              )}
            </div>

            {editingId === pageContent.id ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder="Titre de la page"
                  />
                </div>
                <div>
                  <Label htmlFor="content">Contenu</Label>
                  <Textarea
                    id="content"
                    value={editForm.content}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                    placeholder="Contenu de la page"
                    className="min-h-[200px]"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => savePageContent(pageContent.id)}
                    disabled={saving}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                  <Button variant="outline" onClick={cancelEditing}>
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Titre: </span>
                  <span>{pageContent.title}</span>
                </div>
                <div>
                  <span className="font-medium">Contenu: </span>
                  <p className="text-gray-700 mt-1 whitespace-pre-wrap line-clamp-3">
                    {pageContent.content}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
