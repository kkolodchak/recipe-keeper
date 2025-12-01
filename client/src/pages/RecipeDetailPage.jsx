import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { fetchRecipeById, deleteRecipe } from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import { RecipeDetail } from '../components/Recipe/RecipeDetail.jsx';

export const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
   * Handle edit action
   */
  const handleEdit = () => {
    navigate(`/recipes/${id}/edit`);
  };

  /**
   * Handle delete action
   */
  const handleDelete = async (recipeId) => {
    try {
      setIsDeleting(true);
      await deleteRecipe(recipeId);
      
      // Show success toast
      showToast('Recipe deleted successfully', 'success');

      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Error deleting recipe:', err);
      showToast(err.message || 'Failed to delete recipe', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading recipe...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Recipe Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || 'The recipe you are looking for does not exist or you do not have access to it.'}
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Recipe Detail Component */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <RecipeDetail
          recipe={recipe}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isOwner={isOwner}
        />
      </div>

      {/* Loading overlay for delete */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full mx-4 border border-gray-200">
            <div className="flex items-center gap-4">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <p className="text-gray-900 font-medium">Deleting recipe...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

