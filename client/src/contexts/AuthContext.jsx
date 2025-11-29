import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase.js';

// Create Auth Context
const AuthContext = createContext(null);

/**
 * AuthProvider component that manages authentication state
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Check current auth state on mount
   */
  const checkSession = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        setUser(null);
        setSession(null);
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
    } catch (error) {
      console.error('Error checking session:', error);
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Sign up a new user
   */
  const signUp = useCallback(async (email, password) => {
    // 6. Log at START of signUp function in AuthContext
    console.log('🔍 [AuthContext]', '=== SIGNUP FUNCTION CALLED ===', new Date().toISOString());
    console.log('🔍 [AuthContext]', 'Email:', email);
    console.log('🔍 [AuthContext]', 'Password:', password ? '*'.repeat(password.length) : '(empty)');
    
    try {
      console.log('🔍 [AuthContext]', '📝 Setting loading to true');
      setLoading(true);
      
      // 6. Log BEFORE calling supabase.auth.signUp
      console.log('🔍 [AuthContext]', '📞 Calling supabase.auth.signUp...');
      console.log('🔍 [AuthContext]', 'Supabase client:', supabase);
      console.log('🔍 [AuthContext]', 'supabase.auth:', supabase.auth);
      
      // Validate email and password for non-ASCII characters
      const emailHasNonASCII = /[^\x00-\x7F]/.test(email);
      const passwordHasNonASCII = /[^\x00-\x7F]/.test(password);
      console.log('🔍 [AuthContext]', 'Email contains non-ASCII:', emailHasNonASCII);
      console.log('🔍 [AuthContext]', 'Password contains non-ASCII:', passwordHasNonASCII);
      
      // Ensure email and password are properly encoded
      const encodedEmail = encodeURIComponent(email);
      const signUpParams = {
        email: email.trim(),
        password: password,
      };
      
      console.log('🔍 [AuthContext]', 'SignUp parameters:', {
        email: signUpParams.email,
        password: '*'.repeat(password.length),
        emailLength: signUpParams.email.length,
        passwordLength: password.length,
      });
      
      const { data, error } = await supabase.auth.signUp(signUpParams);

      // 6. Log AFTER supabase.auth.signUp returns
      console.log('🔍 [AuthContext]', '✅ supabase.auth.signUp returned');
      console.log('🔍 [AuthContext]', 'Complete data object:', data);
      console.log('🔍 [AuthContext]', 'Complete error object:', error);
      console.log('🔍 [AuthContext]', 'data.user:', data?.user);
      console.log('🔍 [AuthContext]', 'data.session:', data?.session);
      console.log('🔍 [AuthContext]', 'error?.message:', error?.message);
      console.log('🔍 [AuthContext]', 'error?.status:', error?.status);

      if (error) {
        console.log('🔍 [AuthContext]', '❌ Error exists, throwing error');
        throw error;
      }

      console.log('🔍 [AuthContext]', '✅ No error, setting session and user');
      console.log('🔍 [AuthContext]', '📝 Setting session to:', data.session);
      setSession(data.session);
      console.log('🔍 [AuthContext]', '📝 Setting user to:', data.user);
      setUser(data.user);
      
      const returnValue = { user: data.user, session: data.session, error: null };
      console.log('🔍 [AuthContext]', '📤 Returning success result:', returnValue);
      return returnValue;
    } catch (error) {
      console.log('🔍 [AuthContext]', '💥 CATCH BLOCK: Exception caught in signUp');
      console.error('🔍 [AuthContext]', 'Error object:', error);
      console.error('🔍 [AuthContext]', 'Error message:', error.message);
      console.error('🔍 [AuthContext]', 'Error name:', error.name);
      console.error('🔍 [AuthContext]', 'Error stack:', error.stack);
      
      const returnValue = { user: null, session: null, error };
      console.log('🔍 [AuthContext]', '📤 Returning error result:', returnValue);
      return returnValue;
    } finally {
      console.log('🔍 [AuthContext]', '📝 Setting loading to false');
      setLoading(false);
      console.log('🔍 [AuthContext]', '=== SIGNUP FUNCTION COMPLETED ===');
    }
  }, []);

  /**
   * Sign in an existing user
   */
  const signIn = useCallback(async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      setSession(data.session);
      setUser(data.user);
      return { user: data.user, session: data.session, error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { user: null, session: null, error };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Sign in with Google OAuth
   */
  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      // OAuth redirects, so we don't set user/session here
      return { data, error: null };
    } catch (error) {
      console.error('Error signing in with Google:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Sign out the current user
   */
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      // Don't set loading to false here - let onAuthStateChange handle it
      // This ensures the loading state persists until the auth state change is confirmed
      // The onAuthStateChange listener will update user, session, and loading states
      return { error: null };
    } catch (error) {
      console.error('Error signing out:', error);
      // Only set loading to false on error, otherwise let onAuthStateChange handle it
      setLoading(false);
      return { error };
    }
  }, []);

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Listen to auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use AuthContext
 * @throws {Error} If used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

