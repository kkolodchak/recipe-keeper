import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';

/**
 * ProtectedRoute component that checks authentication before rendering children
 * Redirects to /login if user is not authenticated
 * Automatically redirects when user logs out (user becomes null)
 */
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Watch for user logout and redirect immediately
  useEffect(() => {
    // Only redirect if we're not loading and user is null
    // This handles the case where user logs out while on a protected route
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading spinner while checking auth state
  // This prevents flash of protected content
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
  // This handles initial load when user is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return children;
};

