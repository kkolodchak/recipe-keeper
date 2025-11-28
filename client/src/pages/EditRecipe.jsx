import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { fetchRecipeById, updateRecipe } from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { RecipeForm } from '../components/Recipe/RecipeForm.jsx';

export const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Fetch recipe on mount
  useEffect(() => {
    const loadRecipe = async () => {
      if (!id) {
        setError('Recipe ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await fetchRecipeById(id);
        setRecipe(data);
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError(err.message || 'Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id]);

  /**
   * Check if current user owns the recipe
   */
  const isOwner = recipe && user && recipe.user_id === user.id;

  /**
   * Handle form submission
   */
  const handleSubmit = async (recipeData) => {
    try {
      await updateRecipe(id, recipeData);
      
      // Show success toast
      setToast({
        type: 'success',
        message: 'Recipe updated successfully!',
      });

      // Navigate to recipe detail page after a short delay
      setTimeout(() => {
        navigate(`/recipes/${id}`);
      }, 1500);
    } catch (error) {
      console.error('Error updating recipe:', error);
      setToast({
        type: 'error',
        message: error.message || 'Failed to update recipe. Please try again.',
      });
    }
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    navigate(`/recipes/${id}`);
  };

  /**
   * Close toast
   */
  const closeToast = () => {
    setToast(null);
  };

  // Auto-close toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        closeToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-warm-600 text-lg">Loading recipe...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50 px-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-warm-900 mb-2">Recipe Not Found</h2>
          <p className="text-warm-600 mb-6">
            {error || 'The recipe you are looking for does not exist or you do not have access to it.'}
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Ownership check
  if (!isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50 px-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-warm-900 mb-2">Access Denied</h2>
          <p className="text-warm-600 mb-6">
            You don't have permission to edit this recipe. You can only edit recipes that you created.
          </p>
          <button
            onClick={() => navigate(`/recipes/${id}`)}
            className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors"
          >
            View Recipe
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-50 py-8">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div
            className={`rounded-xl shadow-medium p-4 flex items-center gap-3 min-w-[300px] ${
              toast.type === 'success'
                ? 'bg-fresh-50 border border-fresh-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <div
              className={`flex-shrink-0 ${
                toast.type === 'success' ? 'text-fresh-600' : 'text-red-600'
              }`}
            >
              {toast.type === 'success' ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
            </div>
            <p
              className={`flex-1 text-sm font-medium ${
                toast.type === 'success' ? 'text-fresh-900' : 'text-red-900'
              }`}
            >
              {toast.message}
            </p>
            <button
              onClick={closeToast}
              className="flex-shrink-0 text-warm-400 hover:text-warm-600 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h1 className="text-4xl font-bold text-warm-900">Edit Recipe</h1>
        <p className="text-warm-600 mt-2">
          Update your recipe details below
        </p>
      </div>

      {/* Recipe Form */}
      <RecipeForm
        initialData={recipe}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

