import { supabase } from './supabase.js';

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Helper function to get authentication token from Supabase session
 */
const getAuthToken = async () => {
  console.log('🔍 [API]', '=== GETTING AUTH TOKEN ===');
  const { data: { session }, error } = await supabase.auth.getSession();
  
  console.log('🔍 [API]', 'Session data:', session ? 'exists' : 'null');
  console.log('🔍 [API]', 'Session error:', error);
  
  if (error) {
    console.error('🔍 [API]', '❌ Error getting session:', error);
    throw new Error(`Failed to get session: ${error.message}`);
  }
  
  if (!session || !session.access_token) {
    console.error('🔍 [API]', '❌ No session or access_token');
    console.log('🔍 [API]', 'Session:', session);
    throw new Error('No active session. Please log in.');
  }
  
  console.log('🔍 [API]', '✅ Token retrieved, length:', session.access_token.length);
  console.log('🔍 [API]', 'Token preview:', session.access_token.substring(0, 20) + '...');
  return session.access_token;
};

/**
 * Helper function to make authenticated API requests
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    console.log('🔍 [API]', '=== MAKING API REQUEST ===');
    console.log('🔍 [API]', 'Endpoint:', endpoint);
    console.log('🔍 [API]', 'Method:', options.method || 'GET');
    console.log('🔍 [API]', 'API_URL:', API_URL);
    console.log('🔍 [API]', 'Full URL:', `${API_URL}${endpoint}`);
    console.log('🔍 [API]', 'Request options:', {
      method: options.method || 'GET',
      body: options.body ? (typeof options.body === 'string' ? options.body.substring(0, 200) + '...' : options.body) : undefined,
    });
    
    // Get auth token
    console.log('🔍 [API]', '🔑 Getting authentication token...');
    const token = await getAuthToken();
    console.log('🔍 [API]', '✅ Token retrieved');
    
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };
    
    console.log('🔍 [API]', '📋 Request headers:', {
      'Content-Type': headers['Content-Type'],
      'Authorization': `Bearer ${token.substring(0, 20)}... (length: ${token.length})`,
    });
    
    // Log request body if present
    if (options.body) {
      console.log('🔍 [API]', '📦 Request body:', options.body);
      console.log('🔍 [API]', 'Request body type:', typeof options.body);
      console.log('🔍 [API]', 'Request body length:', options.body.length);
    }
    
    // Make request
    console.log('🔍 [API]', '📞 Making fetch request to:', `${API_URL}${endpoint}`);
    const fetchOptions = {
      ...options,
      headers,
    };
    console.log('🔍 [API]', 'Fetch options:', {
      method: fetchOptions.method,
      headers: Object.keys(fetchOptions.headers),
      body: fetchOptions.body ? 'present' : 'absent',
    });
    
    const response = await fetch(`${API_URL}${endpoint}`, fetchOptions);
    
    console.log('🔍 [API]', '✅ Response received');
    console.log('🔍 [API]', 'Response status:', response.status);
    console.log('🔍 [API]', 'Response status text:', response.statusText);
    console.log('🔍 [API]', 'Response ok:', response.ok);
    console.log('🔍 [API]', 'Response headers:', Object.fromEntries(response.headers.entries()));
    
    // Parse JSON response
    const responseText = await response.text();
    console.log('🔍 [API]', 'Response text (raw):', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('🔍 [API]', 'Response data (parsed):', data);
    } catch (parseError) {
      console.error('🔍 [API]', '❌ Failed to parse JSON response:', parseError);
      console.error('🔍 [API]', 'Response text that failed to parse:', responseText);
      throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`);
    }
    
    // Handle errors
    if (!response.ok) {
      const errorMessage = data.error?.message || data.error || `HTTP error! status: ${response.status}`;
      console.error('🔍 [API]', '❌ Request failed:', errorMessage);
      console.error('🔍 [API]', 'Error details:', data);
      throw new Error(errorMessage);
    }
    
    console.log('🔍 [API]', '✅ Request successful');
    return data;
  } catch (error) {
    console.error('🔍 [API]', '💥 Exception in apiRequest:', error);
    console.error('🔍 [API]', 'Error name:', error.name);
    console.error('🔍 [API]', 'Error message:', error.message);
    console.error('🔍 [API]', 'Error stack:', error.stack);
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
  console.log('🔍 [API]', '=== CREATE RECIPE CALLED ===');
  console.log('🔍 [API]', 'Recipe data received:', recipeData);
  console.log('🔍 [API]', 'Recipe data type:', typeof recipeData);
  console.log('🔍 [API]', 'Recipe data keys:', Object.keys(recipeData));
  
  // Validate required fields
  console.log('🔍 [API]', '🔍 Validating recipe data...');
  if (!recipeData.title) {
    console.error('🔍 [API]', '❌ Validation failed: title is missing');
    throw new Error('Recipe title is required');
  }
  if (recipeData.prep_time === undefined || recipeData.prep_time === null) {
    console.error('🔍 [API]', '❌ Validation failed: prep_time is missing');
    throw new Error('Preparation time is required');
  }
  if (recipeData.cook_time === undefined || recipeData.cook_time === null) {
    console.error('🔍 [API]', '❌ Validation failed: cook_time is missing');
    throw new Error('Cooking time is required');
  }
  if (recipeData.servings === undefined || recipeData.servings === null) {
    console.error('🔍 [API]', '❌ Validation failed: servings is missing');
    throw new Error('Servings is required');
  }
  if (!recipeData.difficulty) {
    console.error('🔍 [API]', '❌ Validation failed: difficulty is missing');
    throw new Error('Difficulty is required');
  }
  if (!['easy', 'medium', 'hard'].includes(recipeData.difficulty)) {
    console.error('🔍 [API]', '❌ Validation failed: invalid difficulty:', recipeData.difficulty);
    throw new Error('Difficulty must be: easy, medium, or hard');
  }
  
  console.log('🔍 [API]', '✅ Validation passed');
  console.log('🔍 [API]', '📦 Stringifying recipe data...');
  const requestBody = JSON.stringify(recipeData);
  console.log('🔍 [API]', 'Request body (stringified):', requestBody);
  console.log('🔍 [API]', 'Request body length:', requestBody.length);
  
  console.log('🔍 [API]', '📞 Calling apiRequest with POST method...');
  const result = await apiRequest('/api/recipes', {
    method: 'POST',
    body: requestBody,
  });
  
  console.log('🔍 [API]', '✅ createRecipe completed successfully');
  console.log('🔍 [API]', 'Result:', result);
  return result;
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

