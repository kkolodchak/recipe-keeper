/**
 * RecipeCardSkeleton component - animated placeholder for recipe cards
 * Matches RecipeCard dimensions and structure
 */
export const RecipeCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 animate-pulse">
      {/* Recipe Image Skeleton */}
      <div className="relative w-full aspect-video bg-gray-200">
        {/* Difficulty Badge Skeleton - Overlay on image */}
        <div className="absolute top-3 right-3">
          <div className="h-6 w-16 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Card Content Skeleton */}
      <div className="p-4">
        {/* Title Skeleton */}
        <div className="h-6 bg-gray-200 rounded-lg mb-2 w-3/4"></div>

        {/* Description Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>

        {/* Recipe Info Row Skeleton */}
        <div className="flex items-center justify-between gap-4">
          {/* Prep Time Skeleton */}
          <div className="flex items-center gap-1.5">
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-4 w-12 bg-gray-200 rounded"></div>
          </div>

          {/* Cook Time Skeleton */}
          <div className="flex items-center gap-1.5">
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-4 w-12 bg-gray-200 rounded"></div>
          </div>

          {/* Servings Skeleton */}
          <div className="flex items-center gap-1.5">
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-4 w-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

