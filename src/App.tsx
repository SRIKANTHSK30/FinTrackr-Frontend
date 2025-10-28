import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Transactions from '@/pages/Transactions';
import Categories from '@/pages/Categories';
import { useAuthStore } from '@/store';
import { useEffect } from 'react';

function App() {
  const { isAuthenticated, setLoading } = useAuthStore();

  useEffect(() => {
    // Check if user is authenticated on app load
    const accessToken = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    
    if (accessToken && user) {
      try {
        const userData = JSON.parse(user);
        useAuthStore.getState().setUser(userData);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        useAuthStore.getState().logout();
      }
    }
    
    setLoading(false);
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
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
