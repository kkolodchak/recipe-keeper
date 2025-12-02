import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';

export const SignUp = () => {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
    setShowSuccess(false);

    // Validate form
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signUp(email, password);
      const { user, session, error } = result;

      if (error) {
        const errorMessage = error.message || 'Failed to create account. Please try again.';
        setSubmitError(errorMessage);
        setIsSubmitting(false);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        return;
      }

      if (user && !session) {
        const confirmationMessage = 'Please check your email to confirm your account before signing in.';
        setSubmitError(confirmationMessage);
        setIsSubmitting(false);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        return;
      }

      if (user && session) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error('Error during sign up:', error);
      const errorMessage = error.message || 'An unexpected error occurred. Please try again.';
      setSubmitError(errorMessage);
      setIsSubmitting(false);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
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
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-warm-900 mb-2">Recipe Keeper</h1>
          <p className="text-warm-600">Create your account to get started</p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white rounded-2xl shadow-medium p-8 border border-warm-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-warm-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`block w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  errors.email
                    ? 'border-red-300 bg-red-50'
                    : 'border-warm-300 bg-warm-50 text-warm-900 placeholder-warm-400'
                }`}
                placeholder="you@example.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-warm-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`block w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  errors.password
                    ? 'border-red-300 bg-red-50'
                    : 'border-warm-300 bg-warm-50 text-warm-900 placeholder-warm-400'
                }`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-warm-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`block w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  errors.confirmPassword
                    ? 'border-red-300 bg-red-50'
                    : 'border-warm-300 bg-warm-50 text-warm-900 placeholder-warm-400'
                }`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="bg-fresh-50 border border-fresh-200 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-fresh-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-fresh-900">Account created successfully!</p>
                  <p className="text-xs text-fresh-700 mt-1">Redirecting to dashboard...</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {submitError && !showSuccess && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            )}

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-warm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-warm-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-warm-500">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full max-w-[152px] bg-white border-2 border-warm-300 text-warm-700 font-semibold py-3 px-4 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-warm-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Sign up with Google</span>
            </button>

            {/* Sign In Link */}
            <div className="text-center pt-4">
              <p className="text-sm text-warm-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

