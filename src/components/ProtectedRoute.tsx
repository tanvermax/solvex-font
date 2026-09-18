// components/ProtectedRoute.tsx - Debug version
import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "@/redux/hook";
import { useCurrentUser, useIsAuthenticated } from "@/redux/features/auth/auth.slice";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = () => {
  const user = useAppSelector(useCurrentUser);
  const isAuthenticated = useAppSelector(useIsAuthenticated);
  const [isLoading, setIsLoading] = useState(true);
  
  const hasToken = !!localStorage.getItem('token') || document.cookie.includes('token');
  
  // 🔥 Debug logs
  useEffect(() => {
    console.log("🔍 ProtectedRoute Debug:", {
      user,
      isAuthenticated,
      hasToken,
      isLoading
    });
  }, [user, isAuthenticated, hasToken, isLoading]);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasToken || !isAuthenticated || !user) {
    console.log("❌ Redirecting to login from ProtectedRoute");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

// ===== ADMIN ROUTE GUARD =====
export const AdminRoute = () => {
  const user = useAppSelector(useCurrentUser);
  const isAuthenticated = useAppSelector(useIsAuthenticated);
  const [isLoading, setIsLoading] = useState(true);
  
  const hasToken = !!localStorage.getItem('token') || document.cookie.includes('token');
  
  // 🔥 Debug logs
  useEffect(() => {
    // console.log("🔍 AdminRoute Debug:", {
    //   user,
    //   isAuthenticated,
    //   hasToken,
    //   userRole: user?.role,
    //   isLoading
    // });
  }, [user, isAuthenticated, hasToken, isLoading]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasToken || !isAuthenticated || !user) {
    console.log("❌ Redirecting to login from AdminRoute - Not authenticated");
    return <Navigate to="/login" replace />;
  }

  // 🔥 Check if user is admin
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    console.log("❌ Redirecting to /dashboard - Not admin", user.role);
    return <Navigate to="/dashboard" replace />;
  }

  console.log("✅ Admin access granted");
  return <Outlet />;
};