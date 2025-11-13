import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useSearchParams,
} from "react-router-dom";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Transactions from "@/pages/Transactions";
import Cards from "@/pages/Your Cards/AtmCards";
import Categories from "@/pages/Categories";
import { useAuthStore } from "@/store";
import { api } from "@/lib/api";

// 🔄 Google OAuth Callback Handler
function AuthCallback() {
  const [searchParams] = useSearchParams();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      api.user
        .getProfile()
        .then((user) => {
          localStorage.setItem("user", JSON.stringify(user));
          setUser(user);
          toast.success("Login successful!");
          window.location.href = "/dashboard";
        })
        .catch((error) => {
          console.error("Failed to get user profile:", error);
          toast.error("Failed to fetch profile. Please login again.");
          window.location.href = "/login";
        });
    } else {
      toast.error("Invalid authentication callback.");
      window.location.href = "/login";
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
  const { isAuthenticated, setUser, setLoading, isLoading } = useAuthStore();

  useEffect(() => {
    const verifyToken = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken && refreshToken) {
        try {
          const user = await api.user.getProfile();
          setUser(user);
        } catch (error) {
          console.error("Failed to verify token:", error);
          toast.error("Session expired. Please login again.");
          useAuthStore.getState().logout();
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [setUser, setLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* 🔐 Public Routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
        />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* 🧭 Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/atm-cards" element={<Cards />} />
        </Route>

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
