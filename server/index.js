import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import recipesRoutes from './routes/recipes.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Configure CORS to allow requests from http://localhost:5173
app.use(cors({
  origin: 'http://localhost:5173',
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
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Recipes API: http://localhost:${PORT}/api/recipes`);
});

