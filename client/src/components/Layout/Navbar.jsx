import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Plus, Book, Home } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { UserMenu } from './UserMenu.jsx';

export const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  /**
   * Handle logout (for mobile menu)
   * ProtectedRoute will automatically redirect to /login when user becomes null
   */
  const handleLogout = async () => {
    try {
      setIsMobileMenuOpen(false);
      const { error } = await signOut();
      if (error) {
        console.error('Error signing out:', error);
        // ProtectedRoute will handle redirect even on error
      }
      // Don't navigate manually - ProtectedRoute will handle redirect automatically
    } catch (error) {
      console.error('Error during logout:', error);
      // ProtectedRoute will handle redirect even on error
    }
  };

  /**
   * Check if route is active
   */
  const isActive = (path) => {
    return location.pathname === path;
  };

  /**
   * Get user email or fallback
   */
  const userEmail = user?.email || 'User';

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-warm-200 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Left */}
            <Link to="/dashboard" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
                Recipe Keeper 🍳
              </span>
            </Link>

            {/* Desktop Navigation - Center */}
            <div className="hidden md:flex items-center space-x-1 flex-1 justify-center">
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 ${
                  isActive('/dashboard')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-warm-700 hover:bg-warm-100'
                }`}
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link
                to="/recipes"
                className={`px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 ${
                  isActive('/recipes')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-warm-700 hover:bg-warm-100'
                }`}
              >
                <Book className="h-4 w-4" />
                My Recipes
              </Link>
              <Link
                to="/create"
                className={`px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 ${
                  isActive('/create')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-warm-700 hover:bg-warm-100'
                }`}
              >
                <Plus className="h-4 w-4" />
                Create Recipe
              </Link>
            </div>

            {/* Desktop User Menu - Right */}
            <div className="hidden md:flex items-center">
              <UserMenu />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-warm-700 hover:bg-warm-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-in Menu */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-medium z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-warm-200">
            <span className="text-lg font-bold text-primary-600">Menu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-xl text-warm-700 hover:bg-warm-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Menu Links */}
          <div className="flex-1 overflow-y-auto py-4">
            <Link
              to="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-colors ${
                isActive('/dashboard')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-warm-700 hover:bg-warm-100'
              }`}
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">Home</span>
            </Link>
            <Link
              to="/recipes"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-colors ${
                isActive('/recipes')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-warm-700 hover:bg-warm-100'
              }`}
            >
              <Book className="h-5 w-5" />
              <span className="font-medium">My Recipes</span>
            </Link>
            <Link
              to="/recipes/new"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-colors ${
                isActive('/recipes/new')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-warm-700 hover:bg-warm-100'
              }`}
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Create Recipe</span>
            </Link>
          </div>

          {/* Mobile User Section */}
          <div className="border-t border-warm-200 p-4">
            <div className="mb-3 px-4">
              <p className="text-sm font-medium text-warm-900">{userEmail}</p>
            </div>
            <Link
              to="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-warm-700 hover:bg-warm-100 transition-colors"
            >
              <User className="h-5 w-5" />
              <span className="font-medium">Profile</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-left"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

