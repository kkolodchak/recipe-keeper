import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { fetchRecipeById, updateRecipe } from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import { RecipeForm } from '../components/Recipe/RecipeForm.jsx';

export const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const errorMessage = err.message || 'Failed to load recipe';
        setError(errorMessage);
        showToast(errorMessage, 'error');
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
      showToast('Recipe updated successfully!', 'success');

      // Navigate to recipe detail page after a short delay
      setTimeout(() => {
        navigate(`/recipes/${id}`);
      }, 1500);
    } catch (error) {
      console.error('Error updating recipe:', error);
      showToast(
        error.message || 'Failed to update recipe. Please try again.',
        'error'
      );
    }
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    navigate(`/recipes/${id}`);
  };

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

