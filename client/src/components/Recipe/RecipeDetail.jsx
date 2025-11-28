import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, ChefHat, Edit, Trash2, ArrowLeft, Check } from 'lucide-react';

/**
 * RecipeDetail component that displays a full recipe
 * @param {Object} props
 * @param {Object} props.recipe - Complete recipe object with ingredients
 * @param {Function} props.onEdit - Callback function for edit action
 * @param {Function} props.onDelete - Callback function for delete action
 * @param {boolean} props.isOwner - Whether current user can edit/delete
 */
export const RecipeDetail = ({ recipe, onEdit, onDelete, isOwner = false }) => {
  const navigate = useNavigate();
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!recipe) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-warm-600">Recipe not found</p>
      </div>
    );
  }

  const {
    id,
    title,
    description,
    prep_time,
    cook_time,
    servings,
    difficulty,
    image_url,
    ingredients = [],
  } = recipe;

  /**
   * Get difficulty badge color classes
   */
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-fresh-100 text-fresh-700 border-fresh-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-warm-100 text-warm-700 border-warm-200';
    }
  };

  /**
   * Format time in minutes to readable format
   */
  const formatTime = (minutes) => {
    if (!minutes) return '0 min';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  /**
   * Toggle ingredient checkbox
   */
  const toggleIngredient = (index) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  /**
   * Handle delete confirmation
   */
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  /**
   * Confirm delete
   */
  const handleConfirmDelete = async () => {
    if (onDelete) {
      await onDelete(id);
    }
    setShowDeleteConfirm(false);
  };

  /**
   * Cancel delete
   */
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  /**
   * Handle back navigation
   */
  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-warm-600 hover:text-warm-900 mb-6 transition-colors group"
      >
        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Dashboard</span>
      </button>

      {/* Hero Section with Image and Title */}
      <div className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden mb-8 shadow-medium">
        {image_url ? (
          <img
            src={image_url}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className={`w-full h-full flex items-center justify-center ${
            image_url ? 'hidden' : 'flex'
          } bg-gradient-to-br from-primary-100 to-primary-200`}
        >
          <ChefHat className="h-24 w-24 text-primary-400" />
        </div>
        
        {/* Title Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
          <div className="w-full p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
              {title || 'Untitled Recipe'}
            </h1>
          </div>
        </div>
      </div>

      {/* Meta Information */}
      <div className="bg-white rounded-xl shadow-soft p-6 md:p-8 mb-8 border border-warm-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {/* Prep Time */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 rounded-xl">
              <Clock className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-warm-600 font-medium">Prep Time</p>
              <p className="text-lg font-bold text-warm-900">{formatTime(prep_time)}</p>
            </div>
          </div>

          {/* Cook Time */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 rounded-xl">
              <Clock className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-warm-600 font-medium">Cook Time</p>
              <p className="text-lg font-bold text-warm-900">{formatTime(cook_time)}</p>
            </div>
          </div>

          {/* Servings */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 rounded-xl">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-warm-600 font-medium">Servings</p>
              <p className="text-lg font-bold text-warm-900">{servings || 'N/A'}</p>
            </div>
          </div>

          {/* Difficulty */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 rounded-xl">
              <ChefHat className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-warm-600 font-medium mb-1">Difficulty</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(
                  difficulty
                )}`}
              >
                {difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="bg-white rounded-xl shadow-soft p-6 md:p-8 mb-8 border border-warm-200">
          <h2 className="text-2xl font-bold text-warm-900 mb-4">Description</h2>
          <p className="text-lg text-warm-700 leading-relaxed whitespace-pre-wrap">
            {description}
          </p>
        </div>
      )}

      {/* Ingredients Section */}
      <div className="bg-white rounded-xl shadow-soft p-6 md:p-8 mb-8 border border-warm-200">
        <h2 className="text-2xl font-bold text-warm-900 mb-6">Ingredients</h2>
        {ingredients.length > 0 ? (
          <ul className="space-y-3">
            {ingredients.map((ingredient, index) => {
              const isChecked = checkedIngredients[index] || false;
              return (
                <li
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl border border-warm-200 hover:bg-warm-50 transition-colors cursor-pointer"
                  onClick={() => toggleIngredient(index)}
                >
                  <div
                    className={`mt-1 flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                      isChecked
                        ? 'bg-primary-500 border-primary-500'
                        : 'border-warm-300 bg-white'
                    }`}
                  >
                    {isChecked && <Check className="h-4 w-4 text-white" />}
                  </div>
                  <div className="flex-1">
                    <span
                      className={`text-lg ${
                        isChecked
                          ? 'line-through text-warm-400'
                          : 'text-warm-900'
                      } transition-all`}
                    >
                      <span className="font-semibold">{ingredient.amount}</span>{' '}
                      <span className="text-warm-600">{ingredient.unit}</span>{' '}
                      <span>{ingredient.name}</span>
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-warm-600">No ingredients listed</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        {isOwner && (
          <>
            <button
              onClick={onEdit}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors font-medium shadow-warm"
            >
              <Edit className="h-5 w-5" />
              <span>Edit Recipe</span>
            </button>
            <button
              onClick={handleDeleteClick}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
            >
              <Trash2 className="h-5 w-5" />
              <span>Delete Recipe</span>
            </button>
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-medium p-6 md:p-8 max-w-md w-full border border-warm-200">
            <h3 className="text-2xl font-bold text-warm-900 mb-4">Delete Recipe?</h3>
            <p className="text-warm-600 mb-6">
              Are you sure you want to delete "{title}"? This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={handleCancelDelete}
                className="px-6 py-3 border-2 border-warm-300 text-warm-700 rounded-xl hover:bg-warm-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

