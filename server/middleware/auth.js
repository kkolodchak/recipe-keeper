import { createClient } from '@supabase/supabase-js';

/**
 * Authentication middleware to verify JWT tokens from Supabase
 * Extracts token from Authorization header and verifies it
 */
export const authenticate = async (req, res, next) => {
  try {
    // Get environment variables inside the function to ensure they're loaded
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;
    
    // Validate environment variables first
    if (!supabaseUrl) {
      console.error('Server configuration error: SUPABASE_URL is missing');
      return res.status(500).json({
        error: {
          message: 'Server configuration error: SUPABASE_URL is missing'
        }
      });
    }

    if (!supabaseKey) {
      console.error('Server configuration error: SUPABASE_ANON_KEY is missing');
      return res.status(500).json({
        error: {
          message: 'Server configuration error: SUPABASE_ANON_KEY is missing'
        }
      });
    }

    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        error: {
          message: 'No authorization header provided'
        }
      });
    }

    // Check if it's a Bearer token
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: {
          message: 'Invalid authorization header format. Expected: Bearer <token>'
        }
      });
    }

    // Extract the token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return res.status(401).json({
        error: {
          message: 'No token provided'
        }
      });
    }

    // Create Supabase client with the token for verification
    let supabase;
    try {
      supabase = createClient(supabaseUrl, supabaseKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      });
    } catch (clientError) {
      console.error('Failed to create Supabase client:', clientError);
      return res.status(500).json({
        error: {
          message: 'Failed to initialize authentication service',
          details: clientError.message
        }
      });
    }

    // Verify token and get user
    let user, error;
    try {
      const result = await supabase.auth.getUser(token);
      user = result.data?.user;
      error = result.error;
    } catch (getUserError) {
      console.error('Token verification failed:', getUserError);
      return res.status(401).json({
        error: {
          message: 'Token verification failed',
          details: getUserError.message
        }
      });
    }

    // Handle invalid or expired token
    if (error || !user) {
      return res.status(401).json({
        error: {
          message: 'Invalid or expired token',
          details: error?.message
        }
      });
    }

    // Check if user exists (additional safety check)
    if (!user.id) {
      return res.status(403).json({
        error: {
          message: 'User not found'
        }
      });
    }

    // Attach user to request object
    req.user = user;
    
    // Continue to next middleware/route
    next();
  } catch (error) {
    console.error('Authentication failed:', error);
    return res.status(401).json({
      error: {
        message: 'Authentication failed',
        details: error.message
      }
    });
  }
};

