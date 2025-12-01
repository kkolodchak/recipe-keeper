import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import { fetchRecipes } from '../services/api.js';
import { useToast } from '../contexts/ToastContext.jsx';
import { RecipeCard } from '../components/Recipe/RecipeCard.jsx';
import { RecipeCardSkeleton } from '../components/Recipe/RecipeCardSkeleton.jsx';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  // Fetch recipes on mount
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchRecipes();
        setRecipes(data || []);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        const errorMessage = err.message || 'Failed to load recipes';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, []);

  // Filter recipes based on search and difficulty
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      searchQuery === '' ||
      recipe.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDifficulty =
      difficultyFilter === 'all' || recipe.difficulty?.toLowerCase() === difficultyFilter;

    return matchesSearch && matchesDifficulty;
  });

  /**
   * Handle create recipe button click
   */
  const handleCreateRecipe = () => {
    navigate('/create');
  };

  /**
   * Loading skeleton component
   */
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <RecipeCardSkeleton key={index} />
      ))}
    </div>
  );

  /**
   * Empty state component
   */
  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
        <Plus className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">No recipes yet</h3>
      <p className="text-gray-600 mb-6">Create your first recipe to get started!</p>
      <button
        onClick={handleCreateRecipe}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
      >
        <Plus className="h-5 w-5" />
        <span>Create Recipe</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Recipes</h1>
              <p className="text-gray-600 text-lg">Manage and organize your favorite recipes</p>
            </div>
            <button
              onClick={handleCreateRecipe}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm self-start sm:self-auto"
            >
              <Plus className="h-5 w-5" />
              <span>Create Recipe</span>
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipes..."
                className="block w-full px-4 py-3 border border-gray-300 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 shadow-sm"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative sm:w-48">
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 appearance-none cursor-pointer shadow-sm"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          {!loading && (
            <p className="mt-4 text-sm text-gray-600">
              {filteredRecipes.length === 1
                ? '1 recipe found'
                : `${filteredRecipes.length} recipes found`}
            </p>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 shadow-sm">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingSkeleton />}

        {/* Empty State */}
        {!loading && !error && filteredRecipes.length === 0 && recipes.length === 0 && (
          <EmptyState />
        )}

        {/* No Results State */}
        {!loading &&
          !error &&
          recipes.length > 0 &&
          filteredRecipes.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No recipes found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}

        {/* Recipes Grid */}
        {!loading && !error && filteredRecipes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

