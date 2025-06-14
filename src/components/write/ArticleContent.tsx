
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
            <p className="font-medium mb-2">Éditeur de texte enrichi et intégration native de médias :</p>
            <ul className="space-y-1 list-disc list-inside">
              <li><strong>Formatage :</strong> Utilisez # pour H1, ## pour H2, ### pour H3</li>
              <li><strong>YouTube :</strong> Collez directement les URLs YouTube - intégration native automatique</li>
              <li><strong>Google Drive :</strong> Partagez vos vidéos/images et collez le lien - intégration native</li>
              <li><strong>Instagram :</strong> Collez les URLs de posts Instagram - affichage natif</li>
              <li><strong>Images :</strong> Collez les URLs directes d'images - affichage optimisé</li>
              <li><strong>Listes :</strong> Utilisez - pour puces ou 1. pour numérotées</li>
              <li><strong>Citations :</strong> Commencez par {'>'}  pour des citations stylées</li>
            </ul>
            <p className="mt-2 text-xs font-medium text-green-700">✨ Tous les médias sont intégrés nativement sans montrer les liens sources !</p>
          </div>
        </div>
      </div>
      <RichTextEditor
        value={content}
        onChange={onContentChange}
        placeholder="Écrivez le contenu de votre article ici... 

Exemples de formatage :
# Mon titre principal
## Mon sous-titre  
### Section importante

- Liste à puces
1. Liste numérotée
> Citation importante

Collez directement vos liens YouTube, Google Drive, Instagram pour une intégration native !"
        rows={15}
      />
    </div>
  );
}
