import PaymentForm from "@/components/PaymentForm";
import DashboardLayout from "@/layouts/dashboard";
import { useGetCurrentUserEstablishment } from "@/services/establishments/queries";
import { useGetSubscriptionsPlans } from "@/services/subscriptions/queries";
import { checkoutParamsSchema } from "@/types";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

const SubscriptionCheckout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const validateParams = () => {
    try {
      return checkoutParamsSchema.parse({
        plan: searchParams.get("plan"),
        establishment: searchParams.get("establishment"),
      });
    } catch {
      return null;
    }
  };

  const params = validateParams();

  useEffect(() => {
    if (!params) {
      navigate("/dashboard/subscription", {
        replace: true,
        state: {
          error: true,
          message: "Parâmetros inválidos. Selecione um plano novamente.",
        },
      });
    }
  }, [params, navigate]);

  const {
    data: establishment,
    isLoading: isLoadingEstablishment,
    error: errorEstablishment,
  } = useGetCurrentUserEstablishment(Boolean(params?.establishment));

  const {
    data: plans,
    isLoading: isLoadingPlans,
    error: errorPlans,
  } = useGetSubscriptionsPlans(Boolean(params?.plan));

  const currentPlan = plans?.find((plan) => plan.id === Number(params?.plan));

  if (!params || isLoadingEstablishment || isLoadingPlans) {
    return <DashboardLayout>Loading...</DashboardLayout>;
  }

  if (
    errorEstablishment ||
    !establishment ||
    errorPlans ||
    !plans ||
    !currentPlan
  ) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-500">
            Erro ao carregar o estabelecimento. Tente novamente mais tarde.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">
              Finalizar Assinatura - {establishment.establishment.name}
            </h1>
            <p className="text-foreground-muted mt-2">
              Complete o pagamento para ativar seu plano da sua barbearia
            </p>
          </div>

          <PaymentForm
            establishment={establishment.establishment}
            plan={currentPlan}
            externalSubscriptionId={
              establishment.establishment.externalSubscriptionId
            }
            externalCustomerId={establishment.establishment.externalCustomerId}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionCheckout;
