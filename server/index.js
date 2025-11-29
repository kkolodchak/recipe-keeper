import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import recipesRoutes from './routes/recipes.js';

// Load environment variables


// Validate required environment variables on startup
console.log('🔍 [Server]', '=== ENVIRONMENT VARIABLES CHECK ===');
console.log('🔍 [Server]', 'SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('🔍 [Server]', 'SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
console.log('🔍 [Server]', 'PORT:', process.env.PORT || '5000 (default)');

if (!process.env.SUPABASE_URL) {
  console.error('❌ [Server]', 'SUPABASE_URL is required but not set in environment variables');
  console.error('❌ [Server]', 'Please create a .env file in the server directory with SUPABASE_URL');
}

if (!process.env.SUPABASE_ANON_KEY && !process.env.SUPABASE_KEY) {
  console.error('❌ [Server]', 'SUPABASE_ANON_KEY is required but not set in environment variables');
  console.error('❌ [Server]', 'Please create a .env file in the server directory with SUPABASE_ANON_KEY');
}

// Create Express app
const app = express();

// Configure CORS to allow requests from Vite dev servers
app.use(cors({
  origin: ['http://localhost:5176', 'http://localhost:5175', 'http://localhost:5173'],
  credentials: true
}));

// JSON body parser middleware
app.use(express.json());

// Mount routes
app.use('/api/recipes', recipesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: { message: 'Route not found' } });
});

// Get PORT from environment or use default
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Recipes API: http://localhost:${PORT}/api/recipes`);
});

