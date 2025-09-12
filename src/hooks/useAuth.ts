import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUser } from "@/context/UserContext";
import { ROUTES } from "@/constants";

/**
 * Hook para redirecionar usuários autenticados para longe da página de login
 */
export const useAuthRedirect = () => {
  const { isAuthenticated, isLoading } = useUser();
  const navigate = useNavigate();

  console.log("oba1");

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return { isAuthenticated, isLoading };
};

/**
 * Hook para proteger rotas que requerem autenticação
 */
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useUser();
  const navigate = useNavigate();

  console.log("oba2");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return { isAuthenticated, isLoading };
};
