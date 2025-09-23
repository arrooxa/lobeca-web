import { ROUTES } from "@/constants";
import DashboardLayout from "@/layouts/dashboard";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const SubscriptionSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate(ROUTES.DASHBOARD_SUBSCRIPTION, { replace: true });
    }, 5000);
  }, [navigate]);

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
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionSuccess;
