import { createClient } from '@supabase/supabase-js';

// Get environment variables for creating Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

/**
 * Authentication middleware to verify JWT tokens from Supabase
 * Extracts token from Authorization header and verifies it
 */
export const authenticate = async (req, res, next) => {
  try {
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
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    });

    // Verify token and get user
    const { data: { user }, error } = await supabase.auth.getUser(token);

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
    console.error('Authentication error:', error);
    return res.status(401).json({
      error: {
        message: 'Authentication failed',
        details: error.message
      }
    });
  }
};

