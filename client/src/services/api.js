import { supabase } from './supabase.js';

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Helper function to get authentication token from Supabase session
 */
const getAuthToken = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    throw new Error(`Failed to get session: ${error.message}`);
  }
  
  if (!session || !session.access_token) {
    throw new Error('No active session. Please log in.');
  }
  
  return session.access_token;
};

/**
 * Helper function to make authenticated API requests
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    // Get auth token
    const token = await getAuthToken();
    
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };
    
    // Make request
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    // Parse JSON response
    const data = await response.json();
    
    // Handle errors
    if (!response.ok) {
      const errorMessage = data.error?.message || data.error || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }
    
    return data;
  } catch (error) {
    // Re-throw with meaningful message
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the server');
    }
    throw error;
  }
};

/**
 * Fetch all recipes for the authenticated user
 * @returns {Promise<Array>} Array of recipe objects with ingredients
 */
export const fetchRecipes = async () => {
  return apiRequest('/api/recipes');
};

/**
 * Fetch a single recipe by ID
 * @param {string} id - Recipe UUID
 * @returns {Promise<Object>} Recipe object with ingredients
 */
export const fetchRecipeById = async (id) => {
  if (!id) {
    throw new Error('Recipe ID is required');
  }
  return apiRequest(`/api/recipes/${id}`);
};

/**
 * Create a new recipe
 * @param {Object} recipeData - Recipe data object
 * @param {string} recipeData.title - Recipe title
 * @param {string} recipeData.description - Recipe description
 * @param {number} recipeData.prep_time - Preparation time in minutes
 * @param {number} recipeData.cook_time - Cooking time in minutes
 * @param {number} recipeData.servings - Number of servings
 * @param {string} recipeData.difficulty - Difficulty level ('easy' | 'medium' | 'hard')
 * @param {string} [recipeData.image_url] - Optional image URL
 * @param {Array} recipeData.ingredients - Array of ingredient objects
 * @param {string} recipeData.ingredients[].name - Ingredient name
 * @param {number} recipeData.ingredients[].amount - Ingredient amount
 * @param {string} recipeData.ingredients[].unit - Ingredient unit
 * @returns {Promise<Object>} Created recipe object with ingredients
 */
export const createRecipe = async (recipeData) => {
  // Validate required fields
  if (!recipeData.title) {
    throw new Error('Recipe title is required');
  }
  if (recipeData.prep_time === undefined || recipeData.prep_time === null) {
    throw new Error('Preparation time is required');
  }
  if (recipeData.cook_time === undefined || recipeData.cook_time === null) {
    throw new Error('Cooking time is required');
  }
  if (recipeData.servings === undefined || recipeData.servings === null) {
    throw new Error('Servings is required');
  }
  if (!recipeData.difficulty) {
    throw new Error('Difficulty is required');
  }
  if (!['easy', 'medium', 'hard'].includes(recipeData.difficulty)) {
    throw new Error('Difficulty must be: easy, medium, or hard');
  }
  
  return apiRequest('/api/recipes', {
    method: 'POST',
    body: JSON.stringify(recipeData),
  });
};

/**
 * Update an existing recipe
 * @param {string} id - Recipe UUID
 * @param {Object} recipeData - Recipe data object (same structure as createRecipe)
 * @returns {Promise<Object>} Updated recipe object with ingredients
 */
export const updateRecipe = async (id, recipeData) => {
  if (!id) {
    throw new Error('Recipe ID is required');
  }
  
  // Validate difficulty if provided
  if (recipeData.difficulty && !['easy', 'medium', 'hard'].includes(recipeData.difficulty)) {
    throw new Error('Difficulty must be: easy, medium, or hard');
  }
  
  return apiRequest(`/api/recipes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(recipeData),
  });
};

/**
 * Delete a recipe
 * @param {string} id - Recipe UUID
 * @returns {Promise<Object>} Success message
 */
export const deleteRecipe = async (id) => {
  if (!id) {
    throw new Error('Recipe ID is required');
  }
  return apiRequest(`/api/recipes/${id}`, {
    method: 'DELETE',
  });
};

