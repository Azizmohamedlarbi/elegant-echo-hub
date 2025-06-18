
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { LogOut, User, PenTool, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminStatus();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-lg sm:text-2xl font-bold text-gray-900">
            <span className="hidden sm:inline">Blog d'Aziz Mohamed Larbi Fillali</span>
            <span className="sm:hidden">Blog d'Aziz</span>
          </Link>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link to="/" className="text-gray-700 hover:text-gray-900 text-sm sm:text-base">
              Accueil
            </Link>
            <Link to="/articles" className="text-gray-700 hover:text-gray-900 text-sm sm:text-base">
              Articles
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-gray-900 text-sm sm:text-base hidden xs:inline">
              À propos
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-gray-900 text-sm sm:text-base xs:hidden">
              About
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={user.email} />
                      <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  {!adminLoading && isAdmin ? (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                        <Settings className="mr-2 h-4 w-4" />
                        Tableau de bord
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/write')}>
                        <PenTool className="mr-2 h-4 w-4" />
                        Écrire un article
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      Profil
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-1 sm:space-x-2">
                <Button variant="ghost" onClick={() => navigate('/auth')} className="text-xs sm:text-sm px-2 sm:px-4">
                  Se connecter
                </Button>
                <Button onClick={() => navigate('/auth')} className="text-xs sm:text-sm px-2 sm:px-4">
                  S'inscrire
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
