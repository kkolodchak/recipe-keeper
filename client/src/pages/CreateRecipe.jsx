import { useNavigate } from 'react-router-dom';
import { createRecipe } from '../services/api.js';
import { RecipeForm } from '../components/Recipe/RecipeForm.jsx';
import { useToast } from '../contexts/ToastContext.jsx';

export const CreateRecipe = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  /**
   * Handle form submission
   */
  const handleSubmit = async (recipeData) => {
    try {
      const createdRecipe = await createRecipe(recipeData);
      
      // Show success toast
      showToast('Recipe created successfully!', 'success');

      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error creating recipe:', error);
      showToast(
        error.message || 'Failed to create recipe. Please try again.',
        'error'
      );
    }
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-warm-50 py-8">
      {/* Page Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h1 className="text-4xl font-bold text-warm-900">Create New Recipe</h1>
        <p className="text-warm-600 mt-2">
          Fill in the details below to add a new recipe to your collection
        </p>
      </div>

      {/* Recipe Form */}
      <RecipeForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
};

