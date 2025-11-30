# Architecture Documentation

> Comprehensive technical documentation for the Recipe Keeper application

---

## 📋 Table of Contents

1. [System Overview](#1-system-overview)
2. [Frontend Architecture](#2-frontend-architecture)
3. [Backend Architecture](#3-backend-architecture)
4. [Database Design](#4-database-design)
5. [Authentication Flow](#5-authentication-flow)
6. [Data Flow](#6-data-flow)
7. [Technology Choices](#7-technology-choices)
8. [Security Considerations](#8-security-considerations)
9. [Deployment Architecture](#9-deployment-architecture)

---

## 1. System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                            │
│                    (React + Vite Frontend)                     │
└────────────────────────┬──────────────────────────────────────┘
                          │
                          │ HTTPS
                          │ JWT Tokens
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Express.js Backend API                       │
│                    (Node.js Server)                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Routes      │  │  Middleware  │  │   Services   │        │
│  │  /api/recipes │  │   (Auth)     │  │   (Supabase)  │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└────────────────────────┬──────────────────────────────────────┘
                         │
                         │ REST API
                         │ JWT Auth
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Supabase Platform                            │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐    │
│  │   Auth Service │  │  PostgreSQL    │  │   RLS Policies │    │
│  │  (JWT Tokens)  │  │   Database     │  │   (Security)    │    │
│  └────────────────┘  └────────────────┘  └────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

```
User Action → React Component → API Service → Express Route
                                              ↓
                                    Auth Middleware
                                              ↓
                                    Supabase Client
                                              ↓
                                    PostgreSQL Database
                                              ↓
                                    RLS Policy Check
                                              ↓
                                    Response → Frontend
```

**Key Components:**
- **Frontend**: React SPA served via Vite dev server (development) or Vercel (production)
- **Backend**: Express.js REST API running on Node.js
- **Database**: PostgreSQL via Supabase with Row Level Security
- **Authentication**: Supabase Auth with JWT tokens

---

## 2. Frontend Architecture

### Folder Structure

```
client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Auth/            # Authentication components
│   │   │   ├── Login.jsx
│   │   │   └── SignUp.jsx
│   │   ├── Layout/          # Layout components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── UserMenu.jsx
│   │   ├── Recipe/         # Recipe-related components
│   │   │   ├── RecipeCard.jsx
│   │   │   ├── RecipeCardSkeleton.jsx
│   │   │   ├── RecipeDetail.jsx
│   │   │   └── RecipeForm.jsx
│   │   └── Toast/           # Notification components
│   │       ├── Toast.jsx
│   │       └── ToastContainer.jsx
│   ├── contexts/            # React Context providers
│   │   ├── AuthContext.jsx  # Authentication state
│   │   └── ToastContext.jsx # Toast notifications
│   ├── pages/               # Page-level components
│   │   ├── Home.jsx
│   │   ├── Dashboard.jsx
│   │   ├── CreateRecipe.jsx
│   │   ├── EditRecipe.jsx
│   │   └── RecipeDetailPage.jsx
│   ├── services/            # API and external services
│   │   ├── api.js           # REST API client
│   │   └── supabase.js       # Supabase client
│   ├── App.jsx              # Root component + routing
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles
├── public/                   # Static assets
├── package.json
├── vite.config.js
└── tailwind.config.js
```

### Component Hierarchy

```
App (Root)
├── AuthProvider (Context)
│   └── ToastProvider (Context)
│       └── BrowserRouter
│           ├── Routes
│           │   ├── / (Home) - Public
│           │   ├── /login (Login) - Public
│           │   ├── /signup (SignUp) - Public
│           │   └── ProtectedLayout
│           │       ├── ProtectedRoute
│           │       │   ├── Navbar
│           │       │   │   └── UserMenu
│           │       │   └── Outlet
│           │       │       ├── /dashboard (Dashboard)
│           │       │       │   └── RecipeCard[]
│           │       │       ├── /create (CreateRecipe)
│           │       │       │   └── RecipeForm
│           │       │       ├── /recipes/:id (RecipeDetailPage)
│           │       │       │   └── RecipeDetail
│           │       │       └── /recipes/:id/edit (EditRecipe)
│           │       │           └── RecipeForm
│           └── ToastContainer (Portal)
```

### State Management Approach

The application uses **React Context API** for global state management:

#### 1. AuthContext
- **Purpose**: Manages authentication state across the app
- **State**:
  - `user`: Current user object (null if not authenticated)
  - `session`: Current session object
  - `loading`: Boolean indicating auth state check in progress
- **Methods**:
  - `signUp(email, password)`: Register new user
  - `signIn(email, password)`: Login user
  - `signOut()`: Logout user
- **Implementation**:
  ```javascript
  // Uses Supabase auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );
    return () => subscription.unsubscribe();
  }, []);
  ```

#### 2. ToastContext
- **Purpose**: Manages toast notifications globally
- **State**:
  - `toasts`: Array of toast objects `[{ id, message, type }]`
- **Methods**:
  - `showToast(message, type)`: Display a toast notification
  - `dismissToast(id)`: Remove a toast
- **Features**:
  - Auto-dismiss after 3 seconds
  - Rendered via React Portal to avoid z-index issues
  - Stack multiple toasts

#### 3. Local State
- Components use `useState` for component-specific state
- Form state managed locally in form components
- No global state management library (Redux, Zustand, etc.) needed

### Routing Strategy

**Library**: React Router DOM v7

**Route Structure**:
```javascript
/                    → Home (public)
/login               → Login (public, redirects if authenticated)
/signup              → SignUp (public, redirects if authenticated)
/dashboard           → Dashboard (protected)
/create              → CreateRecipe (protected)
/recipes/:id         → RecipeDetailPage (protected)
/recipes/:id/edit    → EditRecipe (protected)
```

**Route Protection**:
- `ProtectedRoute`: Wrapper component that checks authentication
  - Shows loading spinner while checking auth state
  - Redirects to `/login` if not authenticated
  - Renders children if authenticated
- `PublicRoute`: Prevents authenticated users from accessing auth pages
  - Redirects to `/dashboard` if already logged in

**Layout Strategy**:
- `ProtectedLayout`: Wraps all protected routes
  - Includes `<Navbar />` for navigation
  - Uses `<Outlet />` to render child routes
- Public routes render without Navbar

---

## 3. Backend Architecture

### Folder Structure

```
server/
├── config/
│   └── supabase.js          # Supabase client configuration
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── routes/
│   └── recipes.js           # Recipe CRUD endpoints
├── index.js                 # Express app entry point
├── schema.sql               # Database schema
├── vercel.json              # Vercel deployment config
├── package.json
└── .env                     # Environment variables
```

### API Design Principles

**RESTful API** following REST conventions:

- **Resource-based URLs**: `/api/recipes`, `/api/recipes/:id`
- **HTTP Methods**:
  - `GET`: Retrieve resources
  - `POST`: Create resources
  - `PUT`: Update resources (full replacement)
  - `DELETE`: Remove resources
- **Status Codes**:
  - `200`: Success
  - `201`: Created
  - `400`: Bad Request (validation errors)
  - `401`: Unauthorized (missing/invalid token)
  - `403`: Forbidden (valid token but insufficient permissions)
  - `404`: Not Found
  - `500`: Internal Server Error
- **Response Format**:
  ```json
  // Success
  { "id": "...", "title": "...", ... }
  
  // Error
  { "error": { "message": "Error description", "details": "..." } }
  ```

### Middleware Pipeline

```
Request
  ↓
CORS Middleware (express.cors)
  ↓
JSON Parser (express.json())
  ↓
Route Handler
  ├── /api/health → Direct response
  └── /api/recipes → authenticate middleware
                      ↓
                    JWT Verification
                      ↓
                    Attach req.user
                      ↓
                    Route Handler (GET/POST/PUT/DELETE)
                      ↓
                    Supabase Query
                      ↓
                    Response
```

**Middleware Order**:
1. **CORS**: Handles cross-origin requests
   - Validates origin against allowed list
   - Sets appropriate headers
2. **JSON Parser**: Parses request body
3. **Authentication**: Verifies JWT token (on protected routes)
4. **Error Handler**: Catches and formats errors

### Error Handling Strategy

**Layered Error Handling**:

1. **Route Level**: Try-catch blocks in route handlers
   ```javascript
   try {
     // Route logic
   } catch (error) {
     console.error('Error:', error);
     res.status(500).json({
       error: {
         message: 'Failed to fetch recipes',
         details: error.message
       }
     });
   }
   ```

2. **Middleware Level**: Authentication errors
   ```javascript
   if (!user) {
     return res.status(401).json({
       error: { message: 'Invalid or expired token' }
     });
   }
   ```

3. **Global Error Handler**: Catches unhandled errors
   ```javascript
   app.use((err, req, res, next) => {
     const statusCode = err.statusCode || 500;
     res.status(statusCode).json({
       error: {
         message: err.message || 'Internal Server Error',
         ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
       }
     });
   });
   ```

4. **404 Handler**: Catches undefined routes
   ```javascript
   app.use((req, res) => {
     res.status(404).json({ error: { message: 'Route not found' } });
   });
   ```

**Error Response Format**:
- Consistent structure: `{ error: { message, details? } }`
- Development mode includes stack traces
- Production mode hides sensitive details

---

## 4. Database Design

### Tables and Relationships

#### Recipes Table

```sql
CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    prep_time INTEGER NOT NULL CHECK (prep_time >= 0),
    cook_time INTEGER NOT NULL CHECK (cook_time >= 0),
    servings INTEGER NOT NULL CHECK (servings > 0),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Relationships**:
- `user_id` → `auth.users(id)`: Many-to-one (many recipes per user)
- `CASCADE DELETE`: Deleting a user deletes all their recipes

#### Ingredients Table

```sql
CREATE TABLE ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    unit TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Relationships**:
- `recipe_id` → `recipes(id)`: Many-to-one (many ingredients per recipe)
- `CASCADE DELETE`: Deleting a recipe deletes all its ingredients

**Entity Relationship Diagram**:
```
auth.users (Supabase)
    │
    │ 1:N
    ▼
recipes
    │
    │ 1:N
    ▼
ingredients
```

### Indexes and Performance Considerations

**Indexes Created**:
```sql
-- Fast user recipe queries
CREATE INDEX idx_recipes_user_id ON recipes(user_id);

-- Fast recipe ingredient queries
CREATE INDEX idx_ingredients_recipe_id ON ingredients(recipe_id);

-- Sorted ingredient retrieval
CREATE INDEX idx_ingredients_order_index ON ingredients(recipe_id, order_index);
```

**Performance Optimizations**:
1. **Foreign Key Indexes**: Speed up JOIN operations
2. **Composite Index**: `(recipe_id, order_index)` for sorted ingredient queries
3. **Query Patterns**:
   - Most queries filter by `user_id` → Indexed
   - Ingredients fetched by `recipe_id` → Indexed
   - Ingredients sorted by `order_index` → Composite index

**Query Examples**:
```sql
-- Fast: Uses idx_recipes_user_id
SELECT * FROM recipes WHERE user_id = '...';

-- Fast: Uses idx_ingredients_recipe_id
SELECT * FROM ingredients WHERE recipe_id = '...' ORDER BY order_index;
```

### Row Level Security Policies

**RLS Enabled**: Both tables have RLS enabled for security

#### Recipes RLS Policies

```sql
-- Users can only view their own recipes
CREATE POLICY "Users can view their own recipes"
    ON recipes FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own recipes
CREATE POLICY "Users can insert their own recipes"
    ON recipes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own recipes
CREATE POLICY "Users can update their own recipes"
    ON recipes FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own recipes
CREATE POLICY "Users can delete their own recipes"
    ON recipes FOR DELETE
    USING (auth.uid() = user_id);
```

#### Ingredients RLS Policies

```sql
-- Users can view ingredients for their own recipes
CREATE POLICY "Users can view ingredients for their own recipes"
    ON ingredients FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM recipes
            WHERE recipes.id = ingredients.recipe_id
            AND recipes.user_id = auth.uid()
        )
    );

-- Similar policies for INSERT, UPDATE, DELETE
```

**Security Benefits**:
- **Database-level security**: Even if API is compromised, users can't access others' data
- **Automatic enforcement**: Supabase enforces policies on all queries
- **No manual checks needed**: Backend doesn't need to verify ownership (RLS does it)

**Trigger**:
```sql
-- Auto-update updated_at timestamp
CREATE TRIGGER update_recipes_updated_at
    BEFORE UPDATE ON recipes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

---

## 5. Authentication Flow

### Sign Up Process

```
1. User fills SignUp form (email, password, confirm password)
   ↓
2. Client-side validation (email format, password match)
   ↓
3. Call AuthContext.signUp(email, password)
   ↓
4. Supabase Client: supabase.auth.signUp({ email, password })
   ↓
5. Supabase creates user in auth.users table
   ↓
6. Supabase sends confirmation email (if email confirmation enabled)
   ↓
7. AuthContext receives user and session
   ↓
8. onAuthStateChange listener fires
   ↓
9. User state updated in AuthContext
   ↓
10. Navigate to /dashboard
```

**Code Flow**:
```javascript
// SignUp.jsx
const handleSubmit = async (e) => {
  const { user, session, error } = await signUp(email, password);
  if (user && session) {
    navigate('/dashboard');
  }
};

// AuthContext.jsx
const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { user: data.user, session: data.session, error };
};
```

### Login Process

```
1. User fills Login form (email, password)
   ↓
2. Call AuthContext.signIn(email, password)
   ↓
3. Supabase Client: supabase.auth.signInWithPassword({ email, password })
   ↓
4. Supabase validates credentials
   ↓
5. Supabase generates JWT token
   ↓
6. AuthContext receives session (contains JWT)
   ↓
7. Session stored in localStorage (by Supabase)
   ↓
8. onAuthStateChange listener fires
   ↓
9. User state updated
   ↓
10. Navigate to /dashboard
```

### Token Management

**JWT Token Structure**:
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user-uuid",
    "email": "user@example.com",
    "iat": 1234567890,
    "exp": 1234571490
  },
  "signature": "..."
}
```

**Token Storage**:
- **Frontend**: Stored by Supabase client in localStorage
- **Backend**: Extracted from `Authorization: Bearer <token>` header
- **Expiration**: Tokens expire after set time (default: 1 hour)
- **Refresh**: Supabase automatically refreshes tokens

**Token Usage**:
```javascript
// Frontend: Include token in API requests
const session = await supabase.auth.getSession();
const token = session.data.session?.access_token;

fetch('/api/recipes', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Backend: Verify token
const token = req.headers.authorization?.substring(7);
const { data: { user } } = await supabase.auth.getUser(token);
```

### Protected Routes

**Frontend Protection**:
```javascript
// ProtectedRoute.jsx
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};
```

**Backend Protection**:
```javascript
// routes/recipes.js
router.use(authenticate); // All routes require authentication

// middleware/auth.js
export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.substring(7);
  const { data: { user } } = await supabase.auth.getUser(token);
  
  if (!user) return res.status(401).json({ error: { message: 'Unauthorized' } });
  
  req.user = user;
  next();
};
```

**Double Protection**:
- **Frontend**: Prevents unauthorized UI access
- **Backend**: Prevents unauthorized API access
- **Database**: RLS policies prevent unauthorized data access

---

## 6. Data Flow

### Recipe Creation Flow (End-to-End)

```
┌─────────────┐
│   User      │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. Fill RecipeForm
       │    - Title, description, times, servings, difficulty
       │    - Add ingredients (name, amount, unit)
       │    - Click "Create Recipe"
       ▼
┌─────────────────────┐
│  CreateRecipe.jsx   │
│  (Page Component)   │
└──────┬──────────────┘
       │
       │ 2. Validate form data
       │ 3. Call createRecipe(recipeData)
       ▼
┌─────────────────────┐
│   api.js            │
│  (API Service)      │
└──────┬──────────────┘
       │
       │ 4. Get JWT token from Supabase session
       │ 5. Build request:
       │    POST /api/recipes
       │    Headers: { Authorization: Bearer <token> }
       │    Body: { title, description, prep_time, ... }
       ▼
┌─────────────────────┐
│  Express Server     │
│  (Backend)          │
└──────┬──────────────┘
       │
       │ 6. CORS middleware validates origin
       │ 7. JSON parser extracts body
       │ 8. authenticate middleware:
       │    - Extracts token from header
       │    - Verifies with Supabase
       │    - Attaches user to req.user
       ▼
┌─────────────────────┐
│  routes/recipes.js  │
│  POST /api/recipes  │
└──────┬──────────────┘
       │
       │ 9. Validate request body
       │ 10. Create Supabase client with user token
       │ 11. Insert recipe:
       │     INSERT INTO recipes (user_id, title, ...)
       │     VALUES (req.user.id, ...)
       │ 12. RLS policy checks: auth.uid() = user_id ✓
       │ 13. Insert ingredients:
       │     INSERT INTO ingredients (recipe_id, ...)
       │     VALUES (recipe.id, ...)
       │ 14. RLS policy checks: recipe belongs to user ✓
       ▼
┌─────────────────────┐
│  PostgreSQL         │
│  (Supabase)         │
└──────┬──────────────┘
       │
       │ 15. Return created recipe with ingredients
       ▼
┌─────────────────────┐
│  routes/recipes.js  │
│  Response: 201      │
└──────┬──────────────┘
       │
       │ 16. Return JSON: { id, title, ..., ingredients: [...] }
       ▼
┌─────────────────────┐
│  api.js             │
│  Parse JSON         │
└──────┬──────────────┘
       │
       │ 17. Return recipe data
       ▼
┌─────────────────────┐
│  CreateRecipe.jsx   │
│  Handle success     │
└──────┬──────────────┘
       │
       │ 18. Show success toast
       │ 19. Navigate to /dashboard
       ▼
┌─────────────┐
│   User      │
│  Sees new   │
│  recipe in  │
│  dashboard  │
└─────────────┘
```

### Request/Response Cycle

**Request Flow**:
1. **User Action** → React event handler
2. **API Call** → `api.js` service function
3. **HTTP Request** → Fetch API with headers
4. **Network** → HTTPS to backend server
5. **CORS Check** → Origin validation
6. **Authentication** → JWT verification
7. **Route Handler** → Business logic
8. **Database Query** → Supabase client
9. **RLS Check** → Policy enforcement
10. **Data Return** → Query results

**Response Flow**:
1. **Database** → Query results
2. **Route Handler** → Format response
3. **HTTP Response** → JSON payload
4. **Network** → HTTPS to frontend
5. **API Service** → Parse JSON
6. **React Component** → Update state
7. **UI Update** → Re-render with new data

**Error Handling**:
- Database errors → Caught in route handler → 500 response
- Validation errors → Caught in route handler → 400 response
- Auth errors → Caught in middleware → 401 response
- Network errors → Caught in API service → Error toast

---

## 7. Technology Choices

### Why React + Vite?

**React**:
- ✅ **Component-based**: Reusable, maintainable UI components
- ✅ **Large ecosystem**: Extensive library support
- ✅ **Developer experience**: Great tooling and debugging
- ✅ **Performance**: Virtual DOM for efficient updates
- ✅ **Community**: Large community and resources

**Vite**:
- ✅ **Fast dev server**: Near-instant HMR (Hot Module Replacement)
- ✅ **Fast builds**: Uses esbuild for production builds
- ✅ **Modern**: Native ES modules, no bundling in dev
- ✅ **Simple config**: Minimal configuration needed
- ✅ **Better than Create React App**: Faster, more modern

**Alternative Considered**: Next.js
- **Not chosen**: Overkill for SPA, adds complexity
- **This app**: Simple SPA doesn't need SSR/SSG

### Why Express?

**Express.js**:
- ✅ **Minimal**: Lightweight, unopinionated framework
- ✅ **Flexible**: Easy to structure as needed
- ✅ **Middleware**: Rich ecosystem of middleware
- ✅ **Mature**: Battle-tested, stable
- ✅ **Simple**: Easy to understand and maintain

**Alternative Considered**: Fastify, Koa
- **Not chosen**: Express has more resources/examples
- **This app**: Simple REST API doesn't need extreme performance

### Why Supabase?

**Supabase**:
- ✅ **All-in-one**: Auth + Database + RLS in one platform
- ✅ **PostgreSQL**: Powerful relational database
- ✅ **RLS**: Database-level security built-in
- ✅ **Real-time**: Built-in real-time subscriptions (future use)
- ✅ **Free tier**: Generous free tier for development
- ✅ **Easy setup**: No database server management
- ✅ **Auto-scaling**: Handles scaling automatically

**Alternative Considered**: Firebase, AWS Amplify
- **Not chosen**: Supabase uses PostgreSQL (more familiar SQL)
- **This app**: Need relational data (recipes + ingredients)

### Why TailwindCSS?

**TailwindCSS**:
- ✅ **Utility-first**: Rapid UI development
- ✅ **No CSS files**: Styles in JSX (co-located)
- ✅ **Small bundle**: Purges unused styles
- ✅ **Consistent**: Design system via config
- ✅ **Responsive**: Built-in responsive utilities
- ✅ **Customizable**: Easy to extend with theme

**Alternative Considered**: CSS Modules, Styled Components
- **Not chosen**: Tailwind faster for rapid prototyping
- **This app**: Need consistent design system quickly

---

## 8. Security Considerations

### Environment Variables

**Purpose**: Store sensitive configuration outside code

**Backend** (`.env`):
```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...  # Public key (safe to expose)
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`.env`):
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...  # Public key (safe in frontend)
VITE_API_URL=http://localhost:5000
```

**Security Practices**:
- ✅ `.env` files in `.gitignore` (never committed)
- ✅ `.env.example` files for documentation
- ✅ Public keys only (anon key is safe to expose)
- ✅ Never expose service role key
- ⚠️ Frontend env vars are bundled (use public keys only)

### JWT Tokens

**Token Security**:
- ✅ **HTTPS only**: Tokens transmitted over HTTPS
- ✅ **Short expiration**: Tokens expire (default: 1 hour)
- ✅ **Automatic refresh**: Supabase handles refresh
- ✅ **HttpOnly cookies**: Not used (localStorage instead)
- ⚠️ **XSS risk**: localStorage vulnerable to XSS (mitigated by React escaping)

**Token Validation**:
```javascript
// Backend verifies token on every request
const { data: { user } } = await supabase.auth.getUser(token);
if (!user) return res.status(401).json({ error: 'Invalid token' });
```

**Token Storage**:
- **Frontend**: localStorage (managed by Supabase client)
- **Backend**: Not stored (validated on each request)

### RLS Policies

**Database-Level Security**:
- ✅ **Enforced at DB level**: Even if API is compromised
- ✅ **Automatic**: No manual checks needed
- ✅ **Comprehensive**: Covers all CRUD operations
- ✅ **User isolation**: Users can't access others' data

**Policy Example**:
```sql
-- Users can only see their own recipes
CREATE POLICY "Users can view their own recipes"
    ON recipes FOR SELECT
    USING (auth.uid() = user_id);
```

**Benefits**:
- Defense in depth (API + Database)
- Prevents SQL injection from accessing wrong data
- Works even if backend logic has bugs

### CORS Configuration

**CORS Setup**:
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5175',
  process.env.FRONTEND_URL || 'https://recipe-keeper.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Security Features**:
- ✅ **Whitelist origins**: Only allowed origins can access API
- ✅ **Credentials**: Allows cookies/auth headers
- ✅ **Specific methods**: Only needed HTTP methods
- ✅ **Specific headers**: Only needed headers

**Production Considerations**:
- Update `FRONTEND_URL` env var with production URL
- Remove localhost origins in production (optional)

### Additional Security Measures

1. **Input Validation**:
   - Frontend: Client-side validation
   - Backend: Server-side validation (required fields, types)
   - Database: Constraints (CHECK, NOT NULL)

2. **SQL Injection Prevention**:
   - Supabase client uses parameterized queries
   - No raw SQL strings in code

3. **XSS Prevention**:
   - React escapes content by default
   - No `dangerouslySetInnerHTML` used

4. **Error Messages**:
   - Production: Generic error messages
   - Development: Detailed error messages

---

## 9. Deployment Architecture

### Frontend on Vercel

**Deployment Flow**:
```
GitHub Repository
    │
    │ Push to main branch
    ▼
Vercel (Connected via GitHub)
    │
    │ Detects changes
    ▼
Build Process
    │
    │ npm install
    │ npm run build (Vite)
    ▼
Static Files Generated
    │
    │ Deploy to CDN
    ▼
https://recipe-keeper-dusky.vercel.app
```

**Vercel Configuration**:
- **Root Directory**: `client/`
- **Build Command**: `npm run build`
- **Output Directory**: `dist/`
- **Framework Preset**: Vite

**Environment Variables** (set in Vercel Dashboard):
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_API_URL=https://recipe-keeper-api.onrender.com
```

**Benefits**:
- ✅ **Automatic deployments**: Push to GitHub → Auto deploy
- ✅ **CDN**: Global CDN for fast loading
- ✅ **HTTPS**: Automatic SSL certificates
- ✅ **Preview deployments**: PR previews
- ✅ **Free tier**: Generous free tier

### Backend on Render

**Deployment Flow**:
```
GitHub Repository
    │
    │ Push to main branch
    ▼
Render (Connected via GitHub)
    │
    │ Detects changes
    ▼
Build Process
    │
    │ npm install
    │ (No build step for Node.js)
    ▼
Start Command
    │
    │ node index.js
    ▼
https://recipe-keeper-api.onrender.com
```

**Render Configuration**:
- **Root Directory**: `server/`
- **Build Command**: `npm install`
- **Start Command**: `node index.js`
- **Environment**: Node.js

**Environment Variables** (set in Render Dashboard):
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
FRONTEND_URL=https://recipe-keeper-dusky.vercel.app
NODE_ENV=production
PORT=10000  # Render assigns port
```

**Benefits**:
- ✅ **Free tier**: Free tier available
- ✅ **Auto-deploy**: GitHub integration
- ✅ **HTTPS**: Automatic SSL
- ✅ **Health checks**: Built-in health monitoring

**Alternative**: Vercel Serverless Functions
- **Not chosen**: Render simpler for Express app
- **Vercel**: Better for serverless functions

### Database on Supabase

**Supabase Hosting**:
- **Location**: Managed by Supabase (AWS/GCP)
- **Backups**: Automatic daily backups
- **Scaling**: Auto-scales as needed
- **Access**: Via Supabase Dashboard or API

**Connection**:
- **Frontend**: Direct connection (via Supabase client)
- **Backend**: Direct connection (via Supabase client)
- **Security**: RLS policies enforce access control

### CI/CD Process

**Current Setup** (GitHub Push → Auto Deploy):

```
Developer
    │
    │ git commit
    │ git push origin main
    ▼
GitHub Repository
    │
    │ Webhook triggers
    ▼
┌─────────────────┐  ┌─────────────────┐
│  Vercel         │  │  Render          │
│  (Frontend)     │  │  (Backend)        │
└─────────────────┘  └─────────────────┘
    │                      │
    │ Build & Deploy      │ Build & Deploy
    ▼                      ▼
Frontend Live          Backend Live
```

**Manual Steps** (if needed):
1. Update environment variables in Vercel/Render dashboards
2. Trigger manual redeploy if needed

**Future Enhancements**:
- GitHub Actions for testing before deploy
- Staging environment
- Database migrations via CI/CD

### Deployment Checklist

**Before Deploying**:
- [ ] Environment variables set in Vercel
- [ ] Environment variables set in Render
- [ ] Database schema applied in Supabase
- [ ] CORS configured for production URL
- [ ] Test production build locally

**After Deploying**:
- [ ] Verify frontend loads
- [ ] Verify backend health check
- [ ] Test authentication flow
- [ ] Test recipe CRUD operations
- [ ] Check error logs in Vercel/Render

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Supabase Documentation](https://supabase.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)

---

**Last Updated**: November 2024

