import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';

/**
 * ProtectedRoute component that checks authentication before rendering children
 * Redirects to /login if user is not authenticated
 */
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-warm-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return children;
};

