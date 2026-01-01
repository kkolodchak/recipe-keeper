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
    try {
      setLoading(true);
      
      // Ensure email and password are properly encoded
      const signUpParams = {
        email: email.trim(),
        password: password,
      };
      
      const { data, error } = await supabase.auth.signUp(signUpParams);

      if (error) {
        throw error;
      }

      setSession(data.session);
      setUser(data.user);
      
      return { user: data.user, session: data.session, error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      return { user: null, session: null, error };
    } finally {
      setLoading(false);
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

