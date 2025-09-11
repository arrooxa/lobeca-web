import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router";
import { useUser } from "@/context/UserContext";
import { ROUTES } from "@/constants";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useUser();
  const navigate = useNavigate();

  console.log({ isAuthenticated, isLoading });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
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
