import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronDown, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';

export const UserMenu = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /**
   * Handle logout
   * ProtectedRoute will automatically redirect to /login when user becomes null
   */
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setIsOpen(false);
      const { error } = await signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        // ProtectedRoute will handle redirect even on error
      }
      // Don't navigate manually - ProtectedRoute will handle redirect automatically
    } catch (error) {
      console.error('Error during logout:', error);
      // ProtectedRoute will handle redirect even on error
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Don't render if no user
  if (!user) return null;

  const userEmail = user?.email || 'User';
  const userInitial = userEmail[0]?.toUpperCase() || 'U';

  return (
    <div className="relative" ref={menuRef}>
      {/* User Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="User menu"
        aria-expanded={isOpen}
        disabled={authLoading}
      >
        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
          {userInitial}
        </div>
        <span className="text-sm font-medium hidden sm:inline max-w-[150px] truncate">
          {userEmail}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-fade-in">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Signed in as</p>
            <p className="text-sm font-medium text-gray-900 truncate">{userEmail}</p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/dashboard');
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
            >
              <User className="h-4 w-4" />
              <span>My Recipes</span>
            </button>

            {/* Divider */}
            <div className="border-t border-gray-200 my-1" />

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut || authLoading}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Logging out...</span>
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
