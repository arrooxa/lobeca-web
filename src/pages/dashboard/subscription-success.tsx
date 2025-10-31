import { ROUTES } from "@/constants";
import DashboardLayout from "@/layouts/dashboard";
import { CheckCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVerifying(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVerifying) {
      const redirectTimer = setTimeout(() => {
        navigate(ROUTES.DASHBOARD_SUBSCRIPTION, { replace: true });
      }, 3000);

      return () => clearTimeout(redirectTimer);
    }
  }, [isVerifying, navigate]);

  if (isVerifying) {
    return (
      <DashboardLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center">
              <Loader2 className="w-16 h-16 text-brand-primary animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Verificando Pagamento...
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Aguarde enquanto confirmamos sua assinatura
            </p>
            {sessionId && (
              <p className="text-xs text-muted-foreground">
                Sessão: {sessionId.substring(0, 20)}...
              </p>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center">
            <div className="relative">
              <CheckCircle className="w-20 h-20 text-green-500 animate-pulse" />
              <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground">
            Assinatura Confirmada!
          </h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Parabéns! Sua assinatura foi processada com sucesso. Bem-vindo à
            nossa plataforma e esperamos que faça bom proveito dos nossos
            serviços.
          </p>
          <p className="text-sm text-muted-foreground">
            Redirecionando em 3 segundos...
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionSuccess;
