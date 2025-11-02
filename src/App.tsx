import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Transactions from '@/pages/Transactions';
import Categories from '@/pages/Categories';
import { useAuthStore } from '@/store';
import { useEffect } from 'react';
import { api } from '@/lib/api';

// Google OAuth Callback Handler (for redirect-based OAuth flow)
function AuthCallback() {
  const [searchParams] = useSearchParams();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');

    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Fetch user profile
      api.user.getProfile()
        .then((user) => {
          localStorage.setItem('user', JSON.stringify(user));
          setUser(user);
          window.location.href = '/dashboard';
        })
        .catch((error) => {
          console.error('Failed to get user profile:', error);
          window.location.href = '/login';
        });
    } else {
      window.location.href = '/login';
    }
  }, [searchParams, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
}
function App() {
  const { isAuthenticated, setLoading } = useAuthStore();

  useEffect(() => {
    // Check if user is authenticated on app load
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (accessToken && refreshToken) {
      // Try to fetch user profile to verify token
      api.user.getProfile()
        .then((user) => {
          useAuthStore.getState().setUser(user);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Failed to verify token:', error);
          useAuthStore.getState().logout();
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [setLoading]);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auth/callback"
          element={<AuthCallback />}
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
