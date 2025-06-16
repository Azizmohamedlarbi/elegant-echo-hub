
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Star } from 'lucide-react';

interface PremiumPromptProps {
  onSignUp: () => void;
}

export function PremiumPrompt({ onSignUp }: PremiumPromptProps) {
  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
          <Lock className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <Star className="h-6 w-6 text-yellow-500 fill-current" />
          Premium Content
          <Star className="h-6 w-6 text-yellow-500 fill-current" />
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-gray-600 text-lg leading-relaxed">
          This article contains premium content. Sign up for free to read the complete article and unlock access to all premium content.
        </p>
        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-2">What you'll get:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Full access to all premium articles</li>
            <li>• Ability to like and comment on articles</li>
            <li>• Personalized reading experience</li>
          </ul>
        </div>
        <Button 
          onClick={onSignUp} 
          size="lg" 
          className="w-full sm:w-auto px-8 py-3 text-lg font-semibold"
        >
          Sign Up for Free
        </Button>
        <p className="text-sm text-gray-500">
          Already have an account? <button onClick={onSignUp} className="text-blue-600 hover:underline font-medium">Sign in here</button>
        </p>
      </CardContent>
    </Card>
  );
}
