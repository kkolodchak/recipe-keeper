# Recipe Keeper 🍳

> Your personal recipe collection - Organize, save, and access your favorite recipes anywhere
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://reactjs.org/)

---

## 🚀 Live Demo

Frontend: https://recipe-keeper-dusky.vercel.app
Backend API: https://recipe-keeper-api.onrender.com
API Health Check: https://recipe-keeper-api.onrender.com/api/health


Test Account
   Email: test@example.com
   Password: password123
(Or create your own account!)

## ✨ Features

- 🔐 **User Authentication** - Secure sign up and login with Supabase Auth
- 📝 **Recipe Management** - Create, read, update, and delete your recipes
- 🥘 **Ingredient Tracking** - Add multiple ingredients with amounts and units
- 🔍 **Search & Filter** - Find recipes quickly by title or difficulty level
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🎨 **Modern UI** - Beautiful, warm color scheme with smooth animations
- ⚡ **Fast Performance** - Optimized with React and efficient database queries
- 🔒 **Secure** - Row Level Security (RLS) ensures users only see their own recipes
- 🎯 **Toast Notifications** - Real-time feedback for all actions
- 🖼️ **Image Support** - Add images to make your recipes more appealing

---

## 🛠️ Tech Stack

### Frontend
- **React** `^19.2.0` - UI library
- **React Router DOM** `^7.9.6` - Client-side routing
- **Vite** `^7.2.4` - Build tool and dev server
- **TailwindCSS** `^4.1.17` - Utility-first CSS framework
- **Lucide React** `^0.555.0` - Icon library
- **Supabase JS** `^2.86.0` - Supabase client for authentication

### Backend
- **Node.js** `18+` - Runtime environment
- **Express** `^5.1.0` - Web framework
- **Supabase JS** `^2.86.0` - Database client
- **CORS** `^2.8.5` - Cross-origin resource sharing
- **dotenv** `^17.2.3` - Environment variable management

### Database & Infrastructure
- **PostgreSQL** (via Supabase) - Relational database
- **Supabase** - Backend-as-a-Service (Auth, Database, RLS)
- **Vercel** - Frontend and backend deployment platform

### Development Tools
- **Nodemon** `^3.1.11` - Auto-restart server during development
- **ESLint** `^9.39.1` - Code linting
- **PostCSS** `^8.5.6` - CSS processing
- **Autoprefixer** `^10.4.22` - CSS vendor prefixing

---

## 🏗️ Architecture Overview

Recipe Keeper follows a modern full-stack architecture with a clear separation of concerns. The **React frontend** communicates with a **Node.js/Express REST API** that handles all business logic and data operations. Authentication and database management are handled by **Supabase**, which provides JWT-based authentication and PostgreSQL database with Row Level Security (RLS) policies. The frontend uses React Context API for global state management (authentication and toast notifications), while the backend implements middleware-based authentication to protect all recipe endpoints. All API requests include JWT tokens in the Authorization header, ensuring secure access to user-specific data.

---

## 🚦 Getting Started

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/kkolodchak/recipe-keeper.git
cd recipe-keeper

# 2. Install dependencies
cd server && npm install
cd ../client && npm install

# 3. Set up environment variables (see below)
# 4. Set up database (see below)
# 5. Run the application (see below)
```

---

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)
- **Supabase Account** - [Sign up](https://supabase.com/) (free tier available)

**Verify installations:**
```bash
node --version  # Should be v18 or higher
npm --version   # Should be v9 or higher
git --version
```

---

### Step 1: Clone and Install

1. **Clone the repository**
   ```bash
   git clone https://github.com/kkolodchak/recipe-keeper
   cd recipe-keeper
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

---

### Step 2: Set Up Supabase

#### 2.1 Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click **"New Project"**
3. Fill in:
   - **Project Name**: `recipe-keeper` (or your choice)
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to you
4. Wait for project to be created (~2 minutes)

#### 2.2 Get API Credentials 
   - Go to Settings → API
   - Copy the Project URL and anon/public key

#### 2.3 Set Up Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy the entire contents of `server/schema.sql`
4. Paste into the SQL Editor
5. Click **"Run"** (or press `Cmd/Ctrl + Enter`)
6. Verify success message: "Success. No rows returned"

**Verify tables were created:**
- Go to **Table Editor** → You should see `recipes` and `ingredients` tables

---

### Step 3: Configure Environment Variables

#### 3.1 Backend (Server)

1. Navigate to the `server/` directory
2. Copy the example file:
   ```bash
   cp .env.example .env
   ```
   > **Note**: If `.env.example` doesn't exist, create `.env` manually

3. Open `.env` and fill in your values:
   ```env
   # Supabase Configuration
   SUPABASE_URL=https://sdqpqzwnfgdzyqbwyyhv.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkcXBxenduZmdkenlxYnd5eWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNzgyMjksImV4cCI6MjA3OTg1NDIyOX0.cxqmYLRdl7rkp-iM47oPdDAR8PC4vB8KQOtJv4fgRrc

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:5173
   ```

#### 3.2 Frontend (Client)

1. Navigate to the `client/` directory
2. Copy the example file:
   ```bash
   cp .env.example .env
   ```
   > **Note**: If `.env.example` doesn't exist, create `.env` manually

3. Open `.env` and fill in your values:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=https://sdqpqzwnfgdzyqbwyyhv.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkcXBxenduZmdkenlxYnd5eWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNzgyMjksImV4cCI6MjA3OTg1NDIyOX0.cxqmYLRdl7rkp-iM47oPdDAR8PC4vB8KQOtJv4fgRrc

   # API URL
   VITE_API_URL=http://localhost:5000
   ```

> **⚠️ Important**: 
> - Never commit `.env` files to Git (they're in `.gitignore`)
> - Use the same Supabase credentials in both files
> - For production, create `.env.production` files with production URLs

---

### Step 4: Run the Application

#### Option A: Run in Separate Terminals (Recommended)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
You should see:
```
🚀 Server is running on port 5000
📍 Health check: http://localhost:5000/api/health
📝 Recipes API: http://localhost:5000/api/recipes
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
You should see:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

#### Option B: Run Both with npm scripts (if configured)

If you have a root `package.json` with scripts, you can run both simultaneously.

---

### Step 5: Verify Installation

1. **Check Backend Health**
   - Open: `http://localhost:5000/api/health`
   - Should return: `{ "status": "ok", "message": "Server is running" }`

2. **Check Frontend**
   - Open: `http://localhost:5173`
   - You should see the Recipe Keeper landing page

3. **Test Authentication**
   - Click **"Get Started"** or navigate to `/signup`
   - Create a test account
   - You should be redirected to `/dashboard` after signup

4. **Test API Connection**
   - After logging in, the dashboard should load (may be empty)
   - Try creating a recipe to verify full functionality

---

### Troubleshooting

#### Backend Issues

**Problem**: `Error: Cannot find module` or `SUPABASE_URL is missing`
- **Solution**: Make sure you created `.env` in the `server/` directory
- Verify: `cd server && cat .env` should show your variables

**Problem**: `Port 5000 already in use`
- **Solution**: Change `PORT` in `server/.env` to another port (e.g., `5001`)
- Update `VITE_API_URL` in `client/.env` to match

**Problem**: `CORS error` when accessing API
- **Solution**: Check `FRONTEND_URL` in `server/.env` matches your frontend port
- If frontend runs on `5175`, update `FRONTEND_URL=http://localhost:5175`

#### Frontend Issues

**Problem**: `Failed to fetch` or network errors
- **Solution**: 
  1. Verify backend is running on `http://localhost:5000`
  2. Check `VITE_API_URL` in `client/.env` is correct
  3. Check browser console for specific error messages

**Problem**: `VITE_SUPABASE_URL is not defined`
- **Solution**: Make sure `.env` file exists in `client/` directory
- Restart the dev server after creating/updating `.env`

**Problem**: Authentication not working
- **Solution**: 
  1. Verify Supabase credentials in both `.env` files
  2. Check Supabase project is active
  3. Verify database schema was created successfully

#### Database Issues

**Problem**: `relation "recipes" does not exist`
- **Solution**: Run the SQL schema from `server/schema.sql` in Supabase SQL Editor

**Problem**: `permission denied` errors
- **Solution**: Verify RLS policies were created (check SQL Editor output)

---

### Development Tips

- **Hot Reload**: Both frontend and backend support hot reload
  - Frontend: Changes reflect immediately
  - Backend: Nodemon restarts server on file changes

- **Environment Variables**: 
  - Frontend: Must restart dev server after changing `.env`
  - Backend: Nodemon will auto-restart

- **Database Changes**: 
  - Use Supabase Dashboard → Table Editor for quick data viewing
  - Use SQL Editor for complex queries

- **Debugging**:
  - Backend: Check terminal for server logs
  - Frontend: Use browser DevTools → Console
  - API: Use browser DevTools → Network tab

---

### Next Steps

Once everything is running:

1. ✅ Create your first recipe
2. ✅ Test editing and deleting recipes
3. ✅ Explore the search and filter features
4. ✅ Check out the responsive design on mobile

Ready to deploy? See the [Deployment](#-deployment) section below!

---

## 📡 API Endpoints

All endpoints require authentication via JWT token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

### Health Check

**GET** `/api/health`

Check if the server is running.

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

### Get All Recipes

**GET** `/api/recipes`

Get all recipes for the authenticated user.

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "title": "Chocolate Chip Cookies",
    "description": "Delicious homemade cookies",
    "prep_time": 15,
    "cook_time": 12,
    "servings": 24,
    "difficulty": "easy",
    "image_url": "https://example.com/image.jpg",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "ingredients": [
      {
        "id": "uuid",
        "recipe_id": "uuid",
        "name": "Flour",
        "amount": 2.5,
        "unit": "cups",
        "order_index": 0,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
]
```

---

### Get Single Recipe

**GET** `/api/recipes/:id`

Get a specific recipe by ID (must belong to authenticated user).

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "Chocolate Chip Cookies",
  "description": "Delicious homemade cookies",
  "prep_time": 15,
  "cook_time": 12,
  "servings": 24,
  "difficulty": "easy",
  "image_url": "https://example.com/image.jpg",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "ingredients": [...]
}
```

**Error Responses:**
- `404` - Recipe not found
- `500` - Server error

---

### Create Recipe

**POST** `/api/recipes`

Create a new recipe with ingredients.

**Request Body:**
```json
{
  "title": "Chocolate Chip Cookies",
  "description": "Delicious homemade cookies",
  "prep_time": 15,
  "cook_time": 12,
  "servings": 24,
  "difficulty": "easy",
  "image_url": "https://example.com/image.jpg",
  "ingredients": [
    {
      "name": "Flour",
      "amount": 2.5,
      "unit": "cups",
      "order_index": 0
    },
    {
      "name": "Sugar",
      "amount": 1,
      "unit": "cup",
      "order_index": 1
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "Chocolate Chip Cookies",
  ...
  "ingredients": [...]
}
```

**Error Responses:**
- `400` - Missing required fields or invalid difficulty
- `500` - Server error

---

### Update Recipe

**PUT** `/api/recipes/:id`

Update an existing recipe (must belong to authenticated user).

**Request Body:**
```json
{
  "title": "Updated Recipe Title",
  "prep_time": 20,
  "ingredients": [
    {
      "name": "New Ingredient",
      "amount": 1,
      "unit": "cup",
      "order_index": 0
    }
  ]
}
```

> **Note**: Only include fields you want to update. Ingredients array will replace all existing ingredients.

**Response:**
```json
{
  "id": "uuid",
  "title": "Updated Recipe Title",
  ...
  "ingredients": [...]
}
```

**Error Responses:**
- `400` - Invalid difficulty value
- `404` - Recipe not found
- `500` - Server error

---

### Delete Recipe

**DELETE** `/api/recipes/:id`

Delete a recipe (must belong to authenticated user). Ingredients are automatically deleted via CASCADE.

**Response:**
```json
{
  "message": "Recipe deleted successfully"
}
```

**Error Responses:**
- `404` - Recipe not found
- `500` - Server error

---

## 🗄️ Database Schema

### Recipes Table

Stores recipe information for each user.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `user_id` | UUID | Foreign key to `auth.users` |
| `title` | TEXT | Recipe title (required) |
| `description` | TEXT | Recipe description (optional) |
| `prep_time` | INTEGER | Preparation time in minutes (required) |
| `cook_time` | INTEGER | Cooking time in minutes (required) |
| `servings` | INTEGER | Number of servings (required) |
| `difficulty` | TEXT | Difficulty level: `easy`, `medium`, or `hard` |
| `image_url` | TEXT | URL to recipe image (optional) |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp (auto-updated) |

**Indexes:**
- `idx_recipes_user_id` - On `user_id` for faster user queries

**RLS Policies:**
- Users can only view, insert, update, and delete their own recipes

---

### Ingredients Table

Stores ingredients for each recipe.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `recipe_id` | UUID | Foreign key to `recipes` (CASCADE delete) |
| `name` | TEXT | Ingredient name (required) |
| `amount` | NUMERIC(10,2) | Ingredient amount (required) |
| `unit` | TEXT | Unit of measurement (required) |
| `order_index` | INTEGER | Display order (default: 0) |
| `created_at` | TIMESTAMP | Creation timestamp |

**Indexes:**
- `idx_ingredients_recipe_id` - On `recipe_id` for faster recipe queries
- `idx_ingredients_order_index` - On `(recipe_id, order_index)` for sorted retrieval

**RLS Policies:**
- Users can only view/modify ingredients for their own recipes

**Triggers:**
- `update_recipes_updated_at` - Automatically updates `recipes.updated_at` when a recipe is modified

---

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Set **Root Directory** to `client`
   - Add environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_API_URL` (your backend URL)

3. **Deploy**
   - Vercel will automatically build and deploy
   - Your frontend will be live at `https://your-project.vercel.app`

### Backend Deployment (Vercel)

1. **Create `vercel.json`** (already included in `server/` directory)

2. **Deploy via Vercel CLI**
   ```bash
   cd server
   npm install -g vercel
   vercel
   ```

3. **Set Environment Variables in Vercel Dashboard**
   - Go to your project settings
   - Add:
     - `SUPABASE_URL`
     - `SUPABASE_ANON_KEY`
     - `FRONTEND_URL` (your frontend URL)
     - `NODE_ENV=production`

4. **Alternative: Deploy via GitHub**
   - Create a separate Vercel project for the backend
   - Set **Root Directory** to `server`
   - Add environment variables
   - Deploy

### Database Setup

1. **Run SQL Schema**
   - In Supabase Dashboard → SQL Editor
   - Run `server/schema.sql`
   - Verify tables are created

2. **Verify RLS Policies**
   - Check that RLS is enabled on both tables
   - Verify policies are active

---

## 🔮 Future Improvements

- [ ] **Recipe Categories/Tags** - Organize recipes by cuisine, meal type, or custom tags
- [ ] **Recipe Sharing** - Share recipes with friends via unique links
- [ ] **Meal Planning** - Plan weekly meals and generate shopping lists
- [ ] **Nutritional Information** - Calculate calories and macros per serving
- [ ] **Recipe Import** - Import recipes from popular recipe websites
- [ ] **Cooking Timer** - Built-in timer for prep and cook times
- [ ] **Recipe Ratings & Reviews** - Rate and review your own recipes
- [ ] **Image Upload** - Direct image upload instead of URL input
- [ ] **Print-Friendly View** - Optimized print layout for recipes
- [ ] **Dark Mode** - Toggle between light and dark themes

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m "Add some amazing feature"
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

Please ensure your code follows the existing style and includes appropriate tests.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Recipe Keeper

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👤 Author

- GitHub: [@kkolodchak](https://github.com/kkolodchak)

---

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for the amazing backend platform
- [Vercel](https://vercel.com/) for seamless deployment
- [TailwindCSS](https://tailwindcss.com/) for the beautiful styling framework
- [Lucide](https://lucide.dev/) for the icon library

---

**Made with ❤️ and 🍳**
