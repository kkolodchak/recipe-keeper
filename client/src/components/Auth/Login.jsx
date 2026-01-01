import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';

export const Login = () => {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validate email format
   */
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Validate form fields
   */
  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        const errorMessage = error.message || 'Failed to sign in. Please check your credentials.';
        setSubmitError(errorMessage);
        showToast(errorMessage, 'error');
        return;
      }

      // Show success toast
      showToast('Successfully signed in!', 'success');

      // Navigate to dashboard on success
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.message || 'An unexpected error occurred. Please try again.';
      setSubmitError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle Google OAuth sign-in
   */
  const handleGoogleSignIn = async () => {
    try {
      setSubmitError('');
      const { error } = await signInWithGoogle();

      if (error) {
        const errorMessage = error.message || 'Failed to sign in with Google. Please try again.';
        setSubmitError(errorMessage);
        showToast(errorMessage, 'error');
        return;
      }

      // OAuth redirects automatically, so we don't navigate here
      // The callback route will handle the redirect
    } catch (error) {
      const errorMessage = error.message || 'An unexpected error occurred. Please try again.';
      setSubmitError(errorMessage);
      showToast(errorMessage, 'error');
    }
  };

  const isLoading = isSubmitting || authLoading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-50 px-4 py-12">
      <div className="w-full max-w-[500px] border border-[#dbdbdb]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-warm-900 mb-2">Recipe Keeper</h1>
          <p className="text-warm-600">Sign in to access your recipes</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-medium p-8 border-warm-200 flex flex-col items-center justify-center">
          <form onSubmit={handleSubmit} className="space-y-6 p-[25px] space-y-6 w-[270px]">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-warm-700 mb-2">
              </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                className={`block w-full border-[#dadada] bg-[#fafafa] h-[36px] pl-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent transition-colors ${
                    errors.email
                      ? 'border-red-300 bg-red-50'
                      : 'text-warm-900 placeholder-warm-400'
                  }`}
                  placeholder="Email"
                  disabled={isLoading}
                />
              {errors.email && (
                <p className="mt-[3px] text-sm font-bold text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-warm-700 mb-2">
              </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                className={`mt-[8px] block border-[#dadada] bg-[#fafafa] w-full h-[36px] pl-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent transition-colors ${
                    errors.password
                      ? 'border-red-300 bg-red-50'
                      : 'text-warm-900 placeholder-warm-400'
                  }`}
                  placeholder="Password"
                  disabled={isLoading}
                />
              {errors.password && (
                <p className="mt-[3px] text-sm font-bold text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm font-bold text-red-600">{submitError}</p>
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#4a5df9] border border-[#7b88f2] mt-[8px] hover:bg-primary-600 text-white font-semibold py-[7px] px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-warm font-bold rounded-[8px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span className="text-[white] font-extrabold text-xl">Sign In</span>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-warm-300"></div>
              </div>
            </div>

            {/* Google Sign In Button */}
            <div className="flex justify-center mt-[16px]">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full max-w-[152px] bg-white border-warm-300 text-warm-700 font-semibold py-3 px-4 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:bg-warm-50"
              >
                Sign in with Google
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center pt-4">
              <p className="text-sm text-warm-600">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

