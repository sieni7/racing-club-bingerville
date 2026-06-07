import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface PrivateRouteProps {
  requiredRole?: ('ADMIN' | 'SUPER_ADMIN' | 'STAFF' | 'MEMBER' | 'JOUEUR' | 'PARENT')[];
}

export const PrivateRoute = ({ requiredRole }: PrivateRouteProps) => {
  const { user, isLoading, profile } = useAuth();

  // Attendre que user ET profile soient résolus
  if (isLoading || (user && !profile)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole && profile && !requiredRole.includes(profile.role as any)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
