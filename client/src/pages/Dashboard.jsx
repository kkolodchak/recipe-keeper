import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, Loader2 } from 'lucide-react';
import { fetchRecipes } from '../services/api.js';
import { RecipeCard } from '../components/Recipe/RecipeCard.jsx';

export const Dashboard = () => {
  const navigate = useNavigate();

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
        setError(err.message || 'Failed to load recipes');
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-soft border border-warm-200 overflow-hidden animate-pulse"
        >
          <div className="w-full aspect-video bg-warm-200"></div>
          <div className="p-5 space-y-3">
            <div className="h-6 bg-warm-200 rounded w-3/4"></div>
            <div className="h-4 bg-warm-200 rounded w-full"></div>
            <div className="h-4 bg-warm-200 rounded w-2/3"></div>
            <div className="flex gap-4 mt-4">
              <div className="h-4 bg-warm-200 rounded w-16"></div>
              <div className="h-4 bg-warm-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  /**
   * Empty state component
   */
  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-24 h-24 bg-warm-100 rounded-full mb-6">
        <Plus className="h-12 w-12 text-warm-400" />
      </div>
      <h3 className="text-2xl font-bold text-warm-900 mb-2">No recipes yet</h3>
      <p className="text-warm-600 mb-6">Create your first recipe to get started!</p>
      <button
        onClick={handleCreateRecipe}
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors shadow-warm"
      >
        <Plus className="h-5 w-5" />
        <span>Create Recipe</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-warm-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-4xl font-bold text-warm-900">My Recipes</h1>
            <button
              onClick={handleCreateRecipe}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors shadow-warm self-start sm:self-auto"
            >
              <Plus className="h-5 w-5" />
              <span>Create Recipe</span>
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-warm-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipes..."
                className="block w-full pl-10 pr-4 py-3 border border-warm-300 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-warm-900 placeholder-warm-400"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative sm:w-48">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-warm-400" />
              </div>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border border-warm-300 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-warm-900 appearance-none cursor-pointer"
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
            <p className="mt-4 text-sm text-warm-600">
              {filteredRecipes.length === 1
                ? '1 recipe found'
                : `${filteredRecipes.length} recipes found`}
            </p>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
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
              <div className="inline-flex items-center justify-center w-24 h-24 bg-warm-100 rounded-full mb-6">
                <Search className="h-12 w-12 text-warm-400" />
              </div>
              <h3 className="text-2xl font-bold text-warm-900 mb-2">No recipes found</h3>
              <p className="text-warm-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}

        {/* Recipes Grid */}
        {!loading && !error && filteredRecipes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

