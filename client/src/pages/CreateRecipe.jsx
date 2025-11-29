import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { createRecipe } from '../services/api.js';
import { RecipeForm } from '../components/Recipe/RecipeForm.jsx';

export const CreateRecipe = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  /**
   * Handle form submission
   */
  const handleSubmit = async (recipeData) => {
    console.log('🔍 [CreateRecipe]', '=== HANDLE SUBMIT CALLED ===');
    console.log('🔍 [CreateRecipe]', 'Received recipe data:', recipeData);
    console.log('🔍 [CreateRecipe]', 'Recipe data type:', typeof recipeData);
    console.log('🔍 [CreateRecipe]', 'Recipe data keys:', Object.keys(recipeData));
    
    try {
      console.log('🔍 [CreateRecipe]', '📞 Calling createRecipe API function...');
      const createdRecipe = await createRecipe(recipeData);
      console.log('🔍 [CreateRecipe]', '✅ Recipe created successfully!');
      console.log('🔍 [CreateRecipe]', 'Created recipe object:', createdRecipe);
      console.log('🔍 [CreateRecipe]', 'Created recipe ID:', createdRecipe?.id);
      
      // Show success toast
      setToast({
        type: 'success',
        message: 'Recipe created successfully!',
      });
      console.log('🔍 [CreateRecipe]', '✅ Success toast set');

      // Navigate to dashboard after a short delay
      setTimeout(() => {
        console.log('🔍 [CreateRecipe]', '🚀 Navigating to /dashboard');
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('🔍 [CreateRecipe]', '❌ ERROR creating recipe:', error);
      console.error('🔍 [CreateRecipe]', 'Error name:', error.name);
      console.error('🔍 [CreateRecipe]', 'Error message:', error.message);
      console.error('🔍 [CreateRecipe]', 'Error stack:', error.stack);
      setToast({
        type: 'error',
        message: error.message || 'Failed to create recipe. Please try again.',
      });
      console.log('🔍 [CreateRecipe]', '❌ Error toast set');
    }
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    navigate('/dashboard');
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

