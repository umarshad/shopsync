import { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'cashier' | 'manager' | 'owner';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, profile, initialized, initialize } = useAuthStore();

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Allow access without authentication for now
  // if (!user || !profile) {
  //   return <Navigate to="/login" replace />;
  // }

  if (requiredRole && profile) {
    const roleHierarchy: Record<string, number> = {
      cashier: 1,
      manager: 2,
      owner: 3
    };

    const userRoleLevel = roleHierarchy[profile.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    if (userRoleLevel < requiredRoleLevel) {
      return <Navigate to="/pos" replace />;
    }
  }

  // If requiredRole is set but no profile, allow access anyway (for development)
  // In production, you might want to redirect to login

  return <>{children}</>;
}

