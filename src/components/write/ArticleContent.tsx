
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
            <p className="font-medium mb-2">Éditeur de texte enrichi et intégration de médias :</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Utilisez la barre d'outils pour formater votre texte avec des titres, gras, italique, listes, etc.</li>
              <li><strong>YouTube :</strong> Collez directement les URLs YouTube (youtube.com/watch?v= ou youtu.be/)</li>
              <li><strong>Google Drive :</strong> Partagez vos vidéos/images et collez le lien de partage</li>
              <li><strong>Instagram :</strong> Collez les URLs de posts Instagram (instagram.com/p/ ou /reel/)</li>
              <li><strong>Facebook :</strong> Collez les URLs de vidéos Facebook</li>
              <li><strong>Vimeo :</strong> Collez les URLs Vimeo pour les vidéos</li>
              <li><strong>Images :</strong> Collez les URLs directes d'images (.jpg, .png, .gif, etc.)</li>
            </ul>
            <p className="mt-2 text-xs">Tous les médias seront intégrés nativement dans votre blog sans montrer la source.</p>
            <p className="mt-1 text-xs font-medium text-blue-900">✨ Améliorations : Meilleure gestion des erreurs, chargement optimisé, et support étendu des formats.</p>
          </div>
        </div>
      </div>
      <RichTextEditor
        value={content}
        onChange={onContentChange}
        placeholder="Écrivez le contenu de votre article ici... Utilisez la barre d'outils ci-dessus pour formater votre texte et collez directement les URLs de médias pour un intégration automatique."
        rows={15}
      />
    </div>
  );
}
