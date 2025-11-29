import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * Helper function to create Supabase client with user's token
 */
const getSupabaseClient = (req) => {
  // Get environment variables inside the function to ensure they're loaded
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration is missing. Please check your environment variables.');
  }
  
  const token = req.headers.authorization?.substring(7); // Remove 'Bearer ' prefix
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });
};

/**
 * Helper function to fetch ingredients for a recipe
 */
const fetchIngredients = async (supabase, recipeId) => {
  const { data: ingredients, error } = await supabase
    .from('ingredients')
    .select('*')
    .eq('recipe_id', recipeId)
    .order('order_index', { ascending: true });

  if (error) {
    throw error;
  }

  return ingredients || [];
};

// Apply auth middleware to all routes
router.use(authenticate);

/**
 * GET /api/recipes
 * Get all recipes for authenticated user with ingredients
 */
router.get('/', async (req, res) => {
  try {
    const supabase = getSupabaseClient(req);
    const userId = req.user.id;

    // Fetch all recipes for the user
    const { data: recipes, error: recipesError } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (recipesError) {
      throw recipesError;
    }

    // Fetch ingredients for each recipe
    const recipesWithIngredients = await Promise.all(
      (recipes || []).map(async (recipe) => {
        const ingredients = await fetchIngredients(supabase, recipe.id);
        return {
          ...recipe,
          ingredients
        };
      })
    );

    res.json(recipesWithIngredients);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch recipes',
        details: error.message
      }
    });
  }
});

/**
 * GET /api/recipes/:id
 * Get single recipe by id with ingredients
 */
router.get('/:id', async (req, res) => {
  try {
    const supabase = getSupabaseClient(req);
    const userId = req.user.id;
    const recipeId = req.params.id;

    // Fetch recipe
    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', recipeId)
      .eq('user_id', userId)
      .single();

    if (recipeError) {
      if (recipeError.code === 'PGRST116') {
        // No rows returned
        return res.status(404).json({
          error: {
            message: 'Recipe not found'
          }
        });
      }
      throw recipeError;
    }

    if (!recipe) {
      return res.status(404).json({
        error: {
          message: 'Recipe not found'
        }
      });
    }

    // Fetch ingredients
    const ingredients = await fetchIngredients(supabase, recipeId);

    res.json({
      ...recipe,
      ingredients
    });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch recipe',
        details: error.message
      }
    });
  }
});

/**
 * POST /api/recipes
 * Create new recipe with ingredients
 */
router.post('/', async (req, res) => {
  try {
    const supabase = getSupabaseClient(req);
    const userId = req.user.id;

    const {
      title,
      description,
      prep_time,
      cook_time,
      servings,
      difficulty,
      image_url,
      ingredients = []
    } = req.body;

    // Validate required fields
    if (!title || prep_time === undefined || cook_time === undefined || 
        servings === undefined || !difficulty) {
      return res.status(400).json({
        error: {
          message: 'Missing required fields: title, prep_time, cook_time, servings, difficulty'
        }
      });
    }

    // Validate difficulty
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return res.status(400).json({
        error: {
          message: 'Invalid difficulty. Must be: easy, medium, or hard'
        }
      });
    }

    // Insert recipe
    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .insert({
        user_id: userId,
        title,
        description: description || null,
        prep_time,
        cook_time,
        servings,
        difficulty,
        image_url: image_url || null
      })
      .select()
      .single();

    if (recipeError) {
      throw recipeError;
    }

    // Insert ingredients if provided
    if (ingredients.length > 0) {
      const ingredientsData = ingredients.map((ing, index) => ({
        recipe_id: recipe.id,
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
        order_index: ing.order_index !== undefined ? ing.order_index : index
      }));

      const { error: ingredientsError } = await supabase
        .from('ingredients')
        .insert(ingredientsData);

      if (ingredientsError) {
        // If ingredients fail, delete the recipe (rollback)
        await supabase.from('recipes').delete().eq('id', recipe.id);
        throw ingredientsError;
      }

      // Fetch inserted ingredients
      const insertedIngredients = await fetchIngredients(supabase, recipe.id);
      recipe.ingredients = insertedIngredients;
    } else {
      recipe.ingredients = [];
    }

    res.status(201).json(recipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({
      error: {
        message: 'Failed to create recipe',
        details: error.message
      }
    });
  }
});

/**
 * PUT /api/recipes/:id
 * Update recipe and ingredients
 */
router.put('/:id', async (req, res) => {
  try {
    const supabase = getSupabaseClient(req);
    const userId = req.user.id;
    const recipeId = req.params.id;

    // First, verify recipe belongs to user
    const { data: existingRecipe, error: checkError } = await supabase
      .from('recipes')
      .select('id')
      .eq('id', recipeId)
      .eq('user_id', userId)
      .single();

    if (checkError || !existingRecipe) {
      return res.status(404).json({
        error: {
          message: 'Recipe not found'
        }
      });
    }

    const {
      title,
      description,
      prep_time,
      cook_time,
      servings,
      difficulty,
      image_url,
      ingredients
    } = req.body;

    // Build update object (only include provided fields)
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (prep_time !== undefined) updateData.prep_time = prep_time;
    if (cook_time !== undefined) updateData.cook_time = cook_time;
    if (servings !== undefined) updateData.servings = servings;
    if (difficulty !== undefined) {
      if (!['easy', 'medium', 'hard'].includes(difficulty)) {
        return res.status(400).json({
          error: {
            message: 'Invalid difficulty. Must be: easy, medium, or hard'
          }
        });
      }
      updateData.difficulty = difficulty;
    }
    if (image_url !== undefined) updateData.image_url = image_url;

    // Update recipe if there are fields to update
    if (Object.keys(updateData).length > 0) {
      const { data: updatedRecipe, error: updateError } = await supabase
        .from('recipes')
        .update(updateData)
        .eq('id', recipeId)
        .eq('user_id', userId)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }
    }

    // Update ingredients if provided
    if (ingredients !== undefined) {
      // Delete existing ingredients
      const { error: deleteError } = await supabase
        .from('ingredients')
        .delete()
        .eq('recipe_id', recipeId);

      if (deleteError) {
        throw deleteError;
      }

      // Insert new ingredients
      if (ingredients.length > 0) {
        const ingredientsData = ingredients.map((ing, index) => ({
          recipe_id: recipeId,
          name: ing.name,
          amount: ing.amount,
          unit: ing.unit,
          order_index: ing.order_index !== undefined ? ing.order_index : index
        }));

        const { error: ingredientsError } = await supabase
          .from('ingredients')
          .insert(ingredientsData);

        if (ingredientsError) {
          throw ingredientsError;
        }
      }
    }

    // Fetch updated recipe with ingredients
    const { data: finalRecipe, error: fetchError } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', recipeId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    const finalIngredients = await fetchIngredients(supabase, recipeId);

    res.json({
      ...finalRecipe,
      ingredients: finalIngredients
    });
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({
      error: {
        message: 'Failed to update recipe',
        details: error.message
      }
    });
  }
});

/**
 * DELETE /api/recipes/:id
 * Delete recipe (ingredients cascade automatically)
 */
router.delete('/:id', async (req, res) => {
  try {
    const supabase = getSupabaseClient(req);
    const userId = req.user.id;
    const recipeId = req.params.id;

    // Verify recipe belongs to user and delete
    const { error: deleteError } = await supabase
      .from('recipes')
      .delete()
      .eq('id', recipeId)
      .eq('user_id', userId);

    if (deleteError) {
      throw deleteError;
    }

    // Check if recipe was actually deleted
    const { data: recipe, error: checkError } = await supabase
      .from('recipes')
      .select('id')
      .eq('id', recipeId)
      .single();

    if (!checkError && recipe) {
      // Recipe still exists but user doesn't own it
      return res.status(404).json({
        error: {
          message: 'Recipe not found'
        }
      });
    }

    res.json({
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({
      error: {
        message: 'Failed to delete recipe',
        details: error.message
      }
    });
  }
});

export default router;
