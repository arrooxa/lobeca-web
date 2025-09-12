import { Outlet } from "react-router";
import { useRequireAuth } from "@/hooks/useAuth";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useRequireAuth();

  if (isLoading) {
    console.log("Loading authentication status...");

    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Outlet />;
}
