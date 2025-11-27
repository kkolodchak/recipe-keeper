-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create recipes table
CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    prep_time INTEGER NOT NULL CHECK (prep_time >= 0), -- minutes
    cook_time INTEGER NOT NULL CHECK (cook_time >= 0), -- minutes
    servings INTEGER NOT NULL CHECK (servings > 0),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ingredients table
CREATE TABLE ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    unit TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes on foreign keys for performance
CREATE INDEX idx_recipes_user_id ON recipes(user_id);
CREATE INDEX idx_ingredients_recipe_id ON ingredients(recipe_id);
CREATE INDEX idx_ingredients_order_index ON ingredients(recipe_id, order_index);

-- Enable Row Level Security
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recipes table
-- Users can only see their own recipes
CREATE POLICY "Users can view their own recipes"
    ON recipes
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own recipes
CREATE POLICY "Users can insert their own recipes"
    ON recipes
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own recipes
CREATE POLICY "Users can update their own recipes"
    ON recipes
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own recipes
CREATE POLICY "Users can delete their own recipes"
    ON recipes
    FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for ingredients table
-- Users can only see ingredients for their own recipes
CREATE POLICY "Users can view ingredients for their own recipes"
    ON ingredients
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM recipes
            WHERE recipes.id = ingredients.recipe_id
            AND recipes.user_id = auth.uid()
        )
    );

-- Users can insert ingredients for their own recipes
CREATE POLICY "Users can insert ingredients for their own recipes"
    ON ingredients
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM recipes
            WHERE recipes.id = ingredients.recipe_id
            AND recipes.user_id = auth.uid()
        )
    );

-- Users can update ingredients for their own recipes
CREATE POLICY "Users can update ingredients for their own recipes"
    ON ingredients
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM recipes
            WHERE recipes.id = ingredients.recipe_id
            AND recipes.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM recipes
            WHERE recipes.id = ingredients.recipe_id
            AND recipes.user_id = auth.uid()
        )
    );

-- Users can delete ingredients for their own recipes
CREATE POLICY "Users can delete ingredients for their own recipes"
    ON ingredients
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM recipes
            WHERE recipes.id = ingredients.recipe_id
            AND recipes.user_id = auth.uid()
        )
    );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on recipes table
CREATE TRIGGER update_recipes_updated_at
    BEFORE UPDATE ON recipes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

