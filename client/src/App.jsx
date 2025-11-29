import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { ToastProvider } from './contexts/ToastContext.jsx';
import { ProtectedRoute } from './components/Layout/ProtectedRoute.jsx';
import { Navbar } from './components/Layout/Navbar.jsx';
import { Home } from './pages/Home.jsx';
import { Login } from './components/Auth/Login.jsx';
import { SignUp } from './components/Auth/SignUp.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { RecipeDetailPage } from './pages/RecipeDetailPage.jsx';
import { CreateRecipe } from './pages/CreateRecipe.jsx';
import { EditRecipe } from './pages/EditRecipe.jsx';

/**
 * ProtectedLayout component that wraps protected routes with Navbar
 */
const ProtectedLayout = () => {
  return (
    <ProtectedRoute>
      <Navbar />
      <Outlet />
    </ProtectedRoute>
  );
};

/**
 * PublicRoute component that redirects to dashboard if already logged in
 */
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-warm-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to dashboard if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignUp />
                </PublicRoute>
              }
            />

            {/* Protected Routes with Navbar */}
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create" element={<CreateRecipe />} />
              <Route path="/recipes/:id/edit" element={<EditRecipe />} />
              <Route path="/recipes/:id" element={<RecipeDetailPage />} />
            </Route>

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

