import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface PrivateRouteProps {
  requiredRole?: 'ADMIN' | 'SUPER_ADMIN' | 'COACH' | 'PLAYER' | 'FAN';
}

export const PrivateRoute = ({ requiredRole }: PrivateRouteProps) => {
  const { user, isLoading } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    async function fetchProfile() {
      if (!user) {
        if (mounted) setIsProfileLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        if (mounted && data) setRole(data.role);
      } catch (err) {
        console.error('Erreur lors de la récupération du profil:', err);
      } finally {
        if (mounted) setIsProfileLoading(false);
      }
    }

    if (!isLoading) {
      fetchProfile();
    }

    return () => {
      mounted = false;
    };
  }, [user, isLoading]);

  if (isLoading || isProfileLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const isAuthorized = role === requiredRole || role === 'SUPER_ADMIN' || (requiredRole === 'ADMIN' && role === 'ADMIN');
    if (!isAuthorized) {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};
