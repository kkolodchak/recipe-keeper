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
    
    console.log('🔍 [Auth Middleware]', '=== AUTHENTICATION CHECK ===');
    console.log('🔍 [Auth Middleware]', 'Request path:', req.path);
    console.log('🔍 [Auth Middleware]', 'Request method:', req.method);
    
    // Validate environment variables first
    if (!supabaseUrl) {
      console.error('🔍 [Auth Middleware]', '❌ SUPABASE_URL is not set');
      return res.status(500).json({
        error: {
          message: 'Server configuration error: SUPABASE_URL is missing'
        }
      });
    }

    if (!supabaseKey) {
      console.error('🔍 [Auth Middleware]', '❌ SUPABASE_ANON_KEY is not set');
      return res.status(500).json({
        error: {
          message: 'Server configuration error: SUPABASE_ANON_KEY is missing'
        }
      });
    }

    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    console.log('🔍 [Auth Middleware]', 'Authorization header:', authHeader ? 'exists' : 'missing');
    console.log('🔍 [Auth Middleware]', 'Authorization header value:', authHeader ? authHeader.substring(0, 30) + '...' : 'null');
    
    if (!authHeader) {
      console.log('🔍 [Auth Middleware]', '❌ No authorization header');
      return res.status(401).json({
        error: {
          message: 'No authorization header provided'
        }
      });
    }

    // Check if it's a Bearer token
    if (!authHeader.startsWith('Bearer ')) {
      console.log('🔍 [Auth Middleware]', '❌ Invalid header format');
      return res.status(401).json({
        error: {
          message: 'Invalid authorization header format. Expected: Bearer <token>'
        }
      });
    }

    // Extract the token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log('🔍 [Auth Middleware]', 'Token extracted, length:', token.length);
    console.log('🔍 [Auth Middleware]', 'Token preview:', token.substring(0, 20) + '...');

    if (!token) {
      console.log('🔍 [Auth Middleware]', '❌ No token after extraction');
      return res.status(401).json({
        error: {
          message: 'No token provided'
        }
      });
    }

    // Check environment variables
    console.log('🔍 [Auth Middleware]', 'Supabase URL exists:', !!supabaseUrl);
    console.log('🔍 [Auth Middleware]', 'Supabase Key exists:', !!supabaseKey);
    console.log('🔍 [Auth Middleware]', 'Supabase URL preview:', supabaseUrl?.substring(0, 30) + '...');
    console.log('🔍 [Auth Middleware]', 'Supabase Key preview:', supabaseKey?.substring(0, 30) + '...');

    // Create Supabase client with the token for verification
    console.log('🔍 [Auth Middleware]', '📞 Creating Supabase client...');
    let supabase;
    try {
      supabase = createClient(supabaseUrl, supabaseKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      });
      console.log('🔍 [Auth Middleware]', '✅ Supabase client created');
    } catch (clientError) {
      console.error('🔍 [Auth Middleware]', '❌ Failed to create Supabase client:', clientError);
      return res.status(500).json({
        error: {
          message: 'Failed to initialize authentication service',
          details: clientError.message
        }
      });
    }

    // Verify token and get user
    console.log('🔍 [Auth Middleware]', '📞 Calling supabase.auth.getUser...');
    let user, error;
    try {
      const result = await supabase.auth.getUser(token);
      user = result.data?.user;
      error = result.error;
      console.log('🔍 [Auth Middleware]', 'getUser completed');
    } catch (getUserError) {
      console.error('🔍 [Auth Middleware]', '❌ Exception in getUser:', getUserError);
      return res.status(401).json({
        error: {
          message: 'Token verification failed',
          details: getUserError.message
        }
      });
    }
    
    console.log('🔍 [Auth Middleware]', 'getUser response - user:', user ? 'exists' : 'null');
    console.log('🔍 [Auth Middleware]', 'getUser response - error:', error);

    // Handle invalid or expired token
    if (error || !user) {
      console.log('🔍 [Auth Middleware]', '❌ Invalid or expired token');
      console.log('🔍 [Auth Middleware]', 'Error details:', error);
      return res.status(401).json({
        error: {
          message: 'Invalid or expired token',
          details: error?.message
        }
      });
    }

    // Check if user exists (additional safety check)
    if (!user.id) {
      console.log('🔍 [Auth Middleware]', '❌ User has no ID');
      return res.status(403).json({
        error: {
          message: 'User not found'
        }
      });
    }

    console.log('🔍 [Auth Middleware]', '✅ Authentication successful');
    console.log('🔍 [Auth Middleware]', 'User ID:', user.id);
    console.log('🔍 [Auth Middleware]', 'User email:', user.email);

    // Attach user to request object
    req.user = user;
    
    // Continue to next middleware/route
    next();
  } catch (error) {
    console.error('🔍 [Auth Middleware]', '💥 Exception in authenticate:', error);
    console.error('🔍 [Auth Middleware]', 'Error message:', error.message);
    console.error('🔍 [Auth Middleware]', 'Error name:', error.name);
    console.error('🔍 [Auth Middleware]', 'Error stack:', error.stack);
    return res.status(401).json({
      error: {
        message: 'Authentication failed',
        details: error.message
      }
    });
  }
};

