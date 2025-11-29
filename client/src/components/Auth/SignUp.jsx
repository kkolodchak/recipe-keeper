import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';

export const SignUp = () => {
  const navigate = useNavigate();
  const { signUp, loading: authLoading } = useAuth();
  
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
    
    // 1. Log at START of handleSubmit
    console.log('🔍 [SignUp]', '=== SIGNUP FORM SUBMITTED ===', new Date().toISOString());
    console.log('🔍 [SignUp]', 'Email:', email);
    console.log('🔍 [SignUp]', 'Password:', password ? '*'.repeat(password.length) : '(empty)');
    
    setSubmitError('');
    setErrors({});
    setShowSuccess(false);
  
    // Validate form
    const isValid = validateForm();
    console.log('🔍 [SignUp]', 'Form validation result:', isValid);
    console.log('🔍 [SignUp]', 'Validation errors:', errors);
    
    if (!isValid) {
      console.log('🔍 [SignUp]', '❌ Form validation failed, returning early');
      return;
    }
  
    // 5. Log state change: setIsSubmitting
    console.log('🔍 [SignUp]', '📝 Setting isSubmitting to true');
    setIsSubmitting(true);
  
    try {
      // 2. Log BEFORE calling signUp
      console.log('🔍 [SignUp]', '📞 Calling signUp function...');
      console.log('🔍 [SignUp]', 'signUp function exists:', typeof signUp === 'function');
      console.log('🔍 [SignUp]', 'signUp function:', signUp);
      
      // signUp returns { user, session, error }
      const result = await signUp(email, password);
      
      // 3. Log AFTER signUp returns
      console.log('🔍 [SignUp]', '✅ SignUp function returned:');
      console.log('🔍 [SignUp]', 'Complete result object:', result);
      
      const { user, session, error } = result;
      console.log('🔍 [SignUp]', 'Destructured user:', user);
      console.log('🔍 [SignUp]', 'Destructured session:', session);
      console.log('🔍 [SignUp]', 'Destructured error:', error);
  
      // 4. Log in EVERY conditional branch
      if (error) {
        console.log('🔍 [SignUp]', '❌ ERROR BRANCH: Error exists');
        console.log('🔍 [SignUp]', 'Error details:', error);
        console.log('🔍 [SignUp]', 'Error message:', error.message);
        
        // Show error first
        const errorMessage = error.message || 'Failed to create account. Please try again.';
        console.log('🔍 [SignUp]', '📝 Setting submitError to:', errorMessage);
        setSubmitError(errorMessage);
        
        console.log('🔍 [SignUp]', '📝 Setting isSubmitting to false');
        setIsSubmitting(false);
        
        // Clear form fields after showing error
        console.log('🔍 [SignUp]', '🧹 Clearing form fields');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        return;
      }
  
      // Check if email confirmation is needed
      if (user && !session) {
        console.log('🔍 [SignUp]', '⚠️ EMAIL CONFIRMATION BRANCH: User exists but no session');
        console.log('🔍 [SignUp]', 'User:', user);
        console.log('🔍 [SignUp]', 'Session:', session);
        
        const confirmationMessage = 'Please check your email to confirm your account before signing in.';
        console.log('🔍 [SignUp]', '📝 Setting submitError to:', confirmationMessage);
        setSubmitError(confirmationMessage);
        
        console.log('🔍 [SignUp]', '📝 Setting isSubmitting to false');
        setIsSubmitting(false);
        
        // Clear form fields after showing error
        console.log('🔍 [SignUp]', '🧹 Clearing form fields');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        return;
      }
  
      // Success - user is logged in
      if (user && session) {
        console.log('🔍 [SignUp]', '✅ SUCCESS BRANCH: User and session both exist');
        console.log('🔍 [SignUp]', 'User:', user);
        console.log('🔍 [SignUp]', 'Session:', session);
        
        console.log('🔍 [SignUp]', '📝 Setting showSuccess to true');
        setShowSuccess(true);
        
        console.log('🔍 [SignUp]', '⏱️ Scheduling navigation to /dashboard in 1500ms');
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          console.log('🔍 [SignUp]', '🚀 Navigating to /dashboard');
          navigate('/dashboard');
        }, 1500);
      } else {
        console.log('🔍 [SignUp]', '⚠️ UNEXPECTED STATE: No user or session');
        console.log('🔍 [SignUp]', 'User:', user);
        console.log('🔍 [SignUp]', 'Session:', session);
      }
    } catch (error) {
      console.log('🔍 [SignUp]', '💥 CATCH BLOCK: Exception caught');
      console.error('🔍 [SignUp]', 'Error object:', error);
      console.error('🔍 [SignUp]', 'Error message:', error.message);
      console.error('🔍 [SignUp]', 'Error stack:', error.stack);
      
      // Show error first
      const errorMessage = error.message || 'An unexpected error occurred. Please try again.';
      console.log('🔍 [SignUp]', '📝 Setting submitError to:', errorMessage);
      setSubmitError(errorMessage);
      
      console.log('🔍 [SignUp]', '📝 Setting isSubmitting to false');
      setIsSubmitting(false);
      
      // Clear form fields after showing error
      console.log('🔍 [SignUp]', '🧹 Clearing form fields');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
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
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-warm-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                    errors.email
                      ? 'border-red-300 bg-red-50'
                      : 'border-warm-300 bg-warm-50 text-warm-900 placeholder-warm-400'
                  }`}
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-warm-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-warm-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                    errors.password
                      ? 'border-red-300 bg-red-50'
                      : 'border-warm-300 bg-warm-50 text-warm-900 placeholder-warm-400'
                  }`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-warm-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-warm-400" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                    errors.confirmPassword
                      ? 'border-red-300 bg-red-50'
                      : 'border-warm-300 bg-warm-50 text-warm-900 placeholder-warm-400'
                  }`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
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

