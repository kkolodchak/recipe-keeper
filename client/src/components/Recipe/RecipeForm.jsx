import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X, Loader2 } from 'lucide-react';

/**
 * RecipeForm component for creating and editing recipes
 * @param {Object} props
 * @param {Object} props.initialData - Initial recipe data for editing (optional)
 * @param {Function} props.onSubmit - Callback function called with recipe data on submit
 * @param {Function} props.onCancel - Callback function called when cancel is clicked
 */
export const RecipeForm = ({ initialData, onSubmit, onCancel }) => {
  const isEditing = !!initialData;

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prep_time: '',
    cook_time: '',
    servings: '',
    difficulty: 'medium',
    image_url: '',
    ingredients: [{ name: '', amount: '', unit: '' }],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with initialData if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        prep_time: initialData.prep_time || '',
        cook_time: initialData.cook_time || '',
        servings: initialData.servings || '',
        difficulty: initialData.difficulty || 'medium',
        image_url: initialData.image_url || '',
        ingredients:
          initialData.ingredients && initialData.ingredients.length > 0
            ? initialData.ingredients.map((ing) => ({
                name: ing.name || '',
                amount: ing.amount || '',
                unit: ing.unit || '',
              }))
            : [{ name: '', amount: '', unit: '' }],
      });
    }
  }, [initialData]);

  /**
   * Update form field
   */
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  /**
   * Update ingredient field
   */
  const handleIngredientChange = (index, field, value) => {
    setFormData((prev) => {
      const newIngredients = [...prev.ingredients];
      newIngredients[index] = {
        ...newIngredients[index],
        [field]: value,
      };
      return {
        ...prev,
        ingredients: newIngredients,
      };
    });
    // Clear ingredient errors
    if (errors.ingredients) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.ingredients;
        return newErrors;
      });
    }
  };

  /**
   * Add new ingredient
   */
  const handleAddIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: '', unit: '' }],
    }));
  };

  /**
   * Remove ingredient
   */
  const handleRemoveIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      setFormData((prev) => ({
        ...prev,
        ingredients: prev.ingredients.filter((_, i) => i !== index),
      }));
    }
  };

  /**
   * Validate form
   */
  const validateForm = () => {
    const newErrors = {};

    // Validate required fields
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.prep_time || formData.prep_time <= 0) {
      newErrors.prep_time = 'Prep time must be greater than 0';
    }

    if (!formData.cook_time || formData.cook_time <= 0) {
      newErrors.cook_time = 'Cook time must be greater than 0';
    }

    if (!formData.servings || formData.servings <= 0) {
      newErrors.servings = 'Servings must be greater than 0';
    }

    if (!formData.difficulty) {
      newErrors.difficulty = 'Difficulty is required';
    }

    // Validate ingredients
    const validIngredients = formData.ingredients.filter(
      (ing) => ing.name.trim() && ing.amount && ing.unit.trim()
    );

    if (validIngredients.length === 0) {
      newErrors.ingredients = 'At least one complete ingredient is required';
    }

    // Validate each ingredient
    formData.ingredients.forEach((ing, index) => {
      if (ing.name.trim() || ing.amount || ing.unit.trim()) {
        if (!ing.name.trim()) {
          newErrors[`ingredient_${index}_name`] = 'Ingredient name is required';
        }
        if (!ing.amount || ing.amount <= 0) {
          newErrors[`ingredient_${index}_amount`] = 'Amount must be greater than 0';
        }
        if (!ing.unit.trim()) {
          newErrors[`ingredient_${index}_unit`] = 'Unit is required';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Filter out empty ingredients and format data
      const validIngredients = formData.ingredients
        .filter((ing) => ing.name.trim() && ing.amount && ing.unit.trim())
        .map((ing) => ({
          name: ing.name.trim(),
          amount: parseFloat(ing.amount),
          unit: ing.unit.trim(),
        }));

      const recipeData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        prep_time: parseInt(formData.prep_time),
        cook_time: parseInt(formData.cook_time),
        servings: parseInt(formData.servings),
        difficulty: formData.difficulty,
        image_url: formData.image_url.trim() || null,
        ingredients: validIngredients,
      };

      await onSubmit(recipeData);
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: error.message || 'Failed to save recipe' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-medium p-6 md:p-8 space-y-8 border border-warm-200">
        {/* Basic Information Section */}
        <div>
          <h2 className="text-2xl font-bold text-warm-900 mb-6">Basic Information</h2>
          <div className="space-y-5">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-warm-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  errors.title
                    ? 'border-red-300 bg-red-50'
                    : 'border-warm-300 bg-warm-50 text-warm-900'
                }`}
                placeholder="e.g., Chocolate Chip Cookies"
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-warm-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none ${
                  errors.description
                    ? 'border-red-300 bg-red-50'
                    : 'border-warm-300 bg-warm-50 text-warm-900'
                }`}
                placeholder="Describe your recipe..."
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Recipe Details Section */}
        <div>
          <h2 className="text-2xl font-bold text-warm-900 mb-6">Recipe Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Prep Time */}
            <div>
              <label htmlFor="prep_time" className="block text-sm font-medium text-warm-700 mb-2">
                Prep Time (minutes) <span className="text-red-500">*</span>
              </label>
              <input
                id="prep_time"
                type="number"
                min="1"
                value={formData.prep_time}
                onChange={(e) => handleChange('prep_time', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  errors.prep_time
                    ? 'border-red-300 bg-red-50'
                    : 'border-warm-300 bg-warm-50 text-warm-900'
                }`}
                placeholder="30"
                disabled={isSubmitting}
              />
              {errors.prep_time && (
                <p className="mt-1 text-sm text-red-600">{errors.prep_time}</p>
              )}
            </div>

            {/* Cook Time */}
            <div>
              <label htmlFor="cook_time" className="block text-sm font-medium text-warm-700 mb-2">
                Cook Time (minutes) <span className="text-red-500">*</span>
              </label>
              <input
                id="cook_time"
                type="number"
                min="1"
                value={formData.cook_time}
                onChange={(e) => handleChange('cook_time', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  errors.cook_time
                    ? 'border-red-300 bg-red-50'
                    : 'border-warm-300 bg-warm-50 text-warm-900'
                }`}
                placeholder="45"
                disabled={isSubmitting}
              />
              {errors.cook_time && (
                <p className="mt-1 text-sm text-red-600">{errors.cook_time}</p>
              )}
            </div>

            {/* Servings */}
            <div>
              <label htmlFor="servings" className="block text-sm font-medium text-warm-700 mb-2">
                Servings <span className="text-red-500">*</span>
              </label>
              <input
                id="servings"
                type="number"
                min="1"
                value={formData.servings}
                onChange={(e) => handleChange('servings', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  errors.servings
                    ? 'border-red-300 bg-red-50'
                    : 'border-warm-300 bg-warm-50 text-warm-900'
                }`}
                placeholder="4"
                disabled={isSubmitting}
              />
              {errors.servings && (
                <p className="mt-1 text-sm text-red-600">{errors.servings}</p>
              )}
            </div>

            {/* Difficulty */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-warm-700 mb-2">
                Difficulty <span className="text-red-500">*</span>
              </label>
              <select
                id="difficulty"
                value={formData.difficulty}
                onChange={(e) => handleChange('difficulty', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  errors.difficulty
                    ? 'border-red-300 bg-red-50'
                    : 'border-warm-300 bg-warm-50 text-warm-900'
                }`}
                disabled={isSubmitting}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              {errors.difficulty && (
                <p className="mt-1 text-sm text-red-600">{errors.difficulty}</p>
              )}
            </div>
          </div>

          {/* Image URL */}
          <div className="mt-5">
            <label htmlFor="image_url" className="block text-sm font-medium text-warm-700 mb-2">
              Image URL (optional)
            </label>
            <input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => handleChange('image_url', e.target.value)}
              className="w-full px-4 py-3 border border-warm-300 bg-warm-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-warm-900"
              placeholder="https://example.com/image.jpg"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Ingredients Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-warm-900">Ingredients</h2>
            <button
              type="button"
              onClick={handleAddIngredient}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
              <span>Add Ingredient</span>
            </button>
          </div>

          {errors.ingredients && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{errors.ingredients}</p>
            </div>
          )}

          <div className="space-y-4">
            {formData.ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-3 p-4 bg-warm-50 rounded-xl border border-warm-200"
              >
                <div className="flex-1">
                  <label className="block text-xs font-medium text-warm-600 mb-1">
                    Ingredient Name
                  </label>
                  <input
                    type="text"
                    value={ingredient.name}
                    onChange={(e) =>
                      handleIngredientChange(index, 'name', e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                      errors[`ingredient_${index}_name`]
                        ? 'border-red-300 bg-red-50'
                        : 'border-warm-300 bg-white text-warm-900'
                    }`}
                    placeholder="e.g., Flour"
                    disabled={isSubmitting}
                  />
                  {errors[`ingredient_${index}_name`] && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors[`ingredient_${index}_name`]}
                    </p>
                  )}
                </div>

                <div className="w-24 sm:w-32">
                  <label className="block text-xs font-medium text-warm-600 mb-1">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={ingredient.amount}
                    onChange={(e) =>
                      handleIngredientChange(index, 'amount', e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                      errors[`ingredient_${index}_amount`]
                        ? 'border-red-300 bg-red-50'
                        : 'border-warm-300 bg-white text-warm-900'
                    }`}
                    placeholder="2"
                    disabled={isSubmitting}
                  />
                  {errors[`ingredient_${index}_amount`] && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors[`ingredient_${index}_amount`]}
                    </p>
                  )}
                </div>

                <div className="w-24 sm:w-32">
                  <label className="block text-xs font-medium text-warm-600 mb-1">Unit</label>
                  <input
                    type="text"
                    value={ingredient.unit}
                    onChange={(e) =>
                      handleIngredientChange(index, 'unit', e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                      errors[`ingredient_${index}_unit`]
                        ? 'border-red-300 bg-red-50'
                        : 'border-warm-300 bg-white text-warm-900'
                    }`}
                    placeholder="cups"
                    disabled={isSubmitting}
                  />
                  {errors[`ingredient_${index}_unit`] && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors[`ingredient_${index}_unit`]}
                    </p>
                  )}
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                    disabled={isSubmitting || formData.ingredients.length === 1}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Remove ingredient"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t border-warm-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-warm-300 text-warm-700 rounded-xl hover:bg-warm-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <X className="h-5 w-5" />
            <span>Cancel</span>
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-warm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>{isEditing ? 'Update Recipe' : 'Create Recipe'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

