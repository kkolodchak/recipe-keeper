import { Link } from 'react-router-dom';
import {
  BookOpen,
  Smartphone,
  ChefHat,
  Plus,
  Utensils,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const Home = () => {
  return (
    <div className="min-h-screen bg-warm-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-warm-50 to-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-warm-900 mb-6 leading-tight">
                Your Personal
                <span className="text-primary-600 block">Recipe Collection</span>
              </h1>
              <p className="text-xl md:text-2xl text-warm-600 mb-8 leading-relaxed">
                Organize, save, and access all your favorite recipes in one beautiful place.
                Never lose a recipe again.
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 text-white text-lg font-semibold rounded-xl hover:bg-primary-600 transition-all duration-300 shadow-warm hover:shadow-medium transform hover:-translate-y-1"
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Hero Illustration */}
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-primary-200 rounded-3xl transform rotate-6 opacity-20"></div>
                <div className="relative bg-white rounded-3xl shadow-medium p-8 border border-warm-200">
                  <div className="flex items-center justify-center mb-6">
                    <div className="p-6 bg-primary-100 rounded-2xl">
                      <ChefHat className="h-16 w-16 text-primary-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-warm-900 mb-2 text-center">
                    Chocolate Chip Cookies
                  </h3>
                  <div className="flex items-center justify-center gap-4 text-sm text-warm-600 mb-4">
                    <span>⏱️ 30 min</span>
                    <span>👥 12 servings</span>
                    <span className="px-2 py-1 bg-fresh-100 text-fresh-700 rounded-full text-xs">
                      Easy
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-warm-200 rounded-full"></div>
                    <div className="h-2 bg-warm-200 rounded-full w-3/4"></div>
                    <div className="h-2 bg-warm-200 rounded-full w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-warm-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-warm-600 max-w-2xl mx-auto">
              A simple, powerful way to manage your recipe collection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Feature 1: Save & Organize */}
            <div className="text-center p-8 rounded-2xl hover:bg-warm-50 transition-colors duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-6">
                <BookOpen className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-warm-900 mb-4">Save & Organize</h3>
              <p className="text-warm-600 leading-relaxed">
                Store all your recipes in one place. Organize by category, difficulty, or
                whatever works for you.
              </p>
            </div>

            {/* Feature 2: Easy to Use */}
            <div className="text-center p-8 rounded-2xl hover:bg-warm-50 transition-colors duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-6">
                <Plus className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-warm-900 mb-4">Easy to Use</h3>
              <p className="text-warm-600 leading-relaxed">
                Simple interface for adding recipes. Just enter your ingredients and steps,
                and you're done.
              </p>
            </div>

            {/* Feature 3: Access Anywhere */}
            <div className="text-center p-8 rounded-2xl hover:bg-warm-50 transition-colors duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-6">
                <Smartphone className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-warm-900 mb-4">Access Anywhere</h3>
              <p className="text-warm-600 leading-relaxed">
                Available on all devices. Access your recipes from your phone, tablet, or
                computer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-32 bg-warm-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-warm-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-warm-600 max-w-2xl mx-auto">
              Get started in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="relative">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500 text-white rounded-full text-3xl font-bold mb-6 shadow-warm">
                  1
                </div>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-6">
                  <span className="text-3xl">🔐</span>
                </div>
                <h3 className="text-2xl font-bold text-warm-900 mb-4">Sign Up for Free</h3>
                <p className="text-warm-600 leading-relaxed">
                  Create your account in seconds. No credit card required, completely free
                  to use.
                </p>
              </div>
              {/* Connector Line (hidden on mobile) */}
              <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-primary-200 -z-10"></div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500 text-white rounded-full text-3xl font-bold mb-6 shadow-warm">
                  2
                </div>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-6">
                  <Utensils className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-warm-900 mb-4">Add Your Recipes</h3>
                <p className="text-warm-600 leading-relaxed">
                  Start adding your favorite recipes. Include ingredients, cooking times, and
                  instructions.
                </p>
              </div>
              {/* Connector Line (hidden on mobile) */}
              <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-primary-200 -z-10"></div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500 text-white rounded-full text-3xl font-bold mb-6 shadow-warm">
                3
              </div>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-6">
                <ChefHat className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-warm-900 mb-4">Cook and Enjoy</h3>
              <p className="text-warm-600 leading-relaxed">
                Access your recipes anytime, anywhere. Follow along with checkboxes and cook
                with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary-500 to-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Start Cooking Today
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of home cooks who are organizing their recipes with Recipe Keeper.
            It's free, simple, and designed for you.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 text-lg font-semibold rounded-xl hover:bg-warm-50 transition-all duration-300 shadow-medium hover:shadow-large transform hover:-translate-y-1"
          >
            Create Your Account
            <ArrowRight className="h-5 w-5" />
          </Link>
          <div className="mt-8 flex items-center justify-center gap-6 text-primary-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Easy setup</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

