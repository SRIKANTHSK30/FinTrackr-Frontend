import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store";
import { Layout } from "@/components/common/Layout";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // ❌ Don't put <Toaster /> here; place it at App root
    return <Navigate to="/login" replace />;
  }

  // ✅ Render Layout (which already contains <Outlet />)
  return <Layout />;
}
