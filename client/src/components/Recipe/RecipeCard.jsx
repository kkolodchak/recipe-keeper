import { useNavigate } from 'react-router-dom';
import { Clock, Users, ChefHat } from 'lucide-react';

/**
 * RecipeCard component that displays a recipe preview
 * @param {Object} recipe - Recipe object with id, title, description, prep_time, cook_time, servings, difficulty, image_url
 */
export const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  if (!recipe) {
    return null;
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
   * Handle card click to navigate to recipe detail
   */
  const handleCardClick = () => {
    navigate(`/recipes/${id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer overflow-hidden border border-warm-200 hover:border-primary-300 group"
    >
      {/* Recipe Image */}
      <div className="relative w-full aspect-video overflow-hidden bg-warm-100">
        {image_url ? (
          <img
            src={image_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className={`w-full h-full flex items-center justify-center ${
            image_url ? 'hidden' : 'flex'
          }`}
        >
          <ChefHat className="h-16 w-16 text-warm-400" />
        </div>

        {/* Difficulty Badge - Overlay on image */}
        {difficulty && (
          <div className="absolute top-3 right-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(
                difficulty
              )}`}
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-warm-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {title || 'Untitled Recipe'}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-warm-600 mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {/* Recipe Info Row */}
        <div className="flex items-center justify-between gap-4 text-sm text-warm-600">
          {/* Prep Time */}
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-warm-400" />
            <span className="font-medium">{formatTime(prep_time)}</span>
          </div>

          {/* Cook Time */}
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-warm-400" />
            <span className="font-medium">{formatTime(cook_time)}</span>
          </div>

          {/* Servings */}
          {servings && (
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-warm-400" />
              <span className="font-medium">{servings}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

