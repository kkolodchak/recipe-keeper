import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../services/supabase.js';
import { useToast } from '../../contexts/ToastContext.jsx';

/**
 * OAuthCallback component handles OAuth redirects from providers like Google
 * This component processes the OAuth callback, extracts the session, and redirects appropriately
 */
export const OAuthCallback = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [error, setError] = useState(null);

  useEffect(() => {
    /**
     * Handle OAuth callback
     */
    const handleOAuthCallback = async () => {
      try {
        // Check for error in URL hash (Supabase passes errors in the hash)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const errorParam = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');

        if (errorParam) {
          const errorMessage = errorDescription || errorParam || 'Authentication was cancelled or failed.';
          console.error('OAuth error in URL:', errorParam, errorDescription);
          setError(errorMessage);
          showToast('Failed to sign in with Google. Please try again.', 'error');
          window.history.replaceState({}, document.title, window.location.pathname);
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 2000);
          return;
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setError(sessionError.message || 'Failed to authenticate. Please try again.');
          showToast('Failed to sign in with Google. Please try again.', 'error');
          window.history.replaceState({}, document.title, window.location.pathname);
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 2000);
          return;
        }

        if (session) {
          showToast('Successfully signed in with Google!', 'success');
          window.history.replaceState({}, document.title, window.location.pathname);
          navigate('/dashboard', { replace: true });
        } else {
          setError('Authentication failed. Please try again.');
          showToast('Failed to sign in with Google. Please try again.', 'error');
          window.history.replaceState({}, document.title, window.location.pathname);
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 2000);
        }
      } catch (error) {
        console.error('Error handling OAuth callback:', error);
        setError(error.message || 'An unexpected error occurred. Please try again.');
        showToast('Failed to sign in with Google. Please try again.', 'error');
        window.history.replaceState({}, document.title, window.location.pathname);
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      }
    };

    // Process the callback
    handleOAuthCallback();
  }, [navigate, showToast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-50 px-4">
      <div className="w-full max-w-md text-center">
        {error ? (
          <>
            <div className="bg-white rounded-2xl shadow-medium p-8 border border-warm-200">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-warm-900 mb-2">Authentication Error</h2>
              <p className="text-warm-600 mb-4">{error}</p>
              <p className="text-sm text-warm-500">Redirecting to login...</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-medium p-8 border border-warm-200">
              <Loader2 className="h-12 w-12 text-primary-500 animate-spin mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-warm-900 mb-2">Completing sign in...</h2>
              <p className="text-warm-600">Please wait while we finish setting up your account.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

