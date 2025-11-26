import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import {
  Crown,
  Scissors,
  Star,
  Check,
  CheckCheck,
  X,
  ShieldX,
} from "lucide-react";
import DashboardLayout from "@/layouts/dashboard";
import { useGetCurrentUserEstablishment } from "@/services/establishments/queries";
import {
  useCancelSubscription,
  useGetSubscriptionsPlans,
} from "@/services/subscriptions/queries";
import { cn } from "@/utils/cn";
import { useNavigate } from "react-router";
import { defaultToastProps, ROUTES, WHATSAPP_WEB_LINK } from "@/constants";
import { intervalToDuration } from "date-fns";
import { useState } from "react";
import { toast } from "react-toastify";
import { formatMoney } from "@/utils/money";

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);
  const [isCancellingSubscription, setIsCancellingSubscription] =
    useState(false);
  const [billingInterval, setBillingInterval] = useState<"monthly" | "annual">(
    "monthly"
  );

  const cancelSubscriptionMutation = useCancelSubscription();

  const {
    data: establishment,
    isLoading: isLoadingEstablishment,
    error: errorEstablishment,
  } = useGetCurrentUserEstablishment();

  const {
    data: plans,
    isLoading: isLoadingPlans,
    error: errorPlans,
  } = useGetSubscriptionsPlans();

  if (isLoadingEstablishment || isLoadingPlans) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p>Carregando informações da assinatura...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (errorEstablishment || !establishment || errorPlans || !plans) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p>
            Erro ao carregar informações da assinatura. Por favor, tente
            novamente mais tarde.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const isEstablishmentCanceled = establishment.status === "canceled";

  const currentPlan = plans.find((p) => p.id === establishment.planID);

  // Filtra planos pelo billing interval selecionado
  const filteredPlans = plans.filter(
    (p) => p.billingInterval === billingInterval
  );

  const popularPlan = filteredPlans.find((p) => p.name === "Growth");

  const enterprisePlan = filteredPlans.find((p) => p.maxWorkers === undefined);

  const handlePlanChange = async (planID: number) => {
    const searchParams = new URLSearchParams({
      plan: planID.toString(),
      establishment: establishment.id.toString(),
    });

    navigate(`${ROUTES.DASHBOARD_SUBSCRIPTION_CHECKOUT}?${searchParams}`);
  };

  const handleCancelSubscription = async () => {
    try {
      setIsCancellingSubscription(true);

      await cancelSubscriptionMutation.mutateAsync({
        establishmentUUID: establishment.uuid,
      });

      toast.success("Assinatura cancelada com sucesso.", defaultToastProps);

      setIsConfirmCancelOpen(false);
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      console.error("Erro ao cancelar assinatura:", error);
      toast.error(
        "Erro ao cancelar assinatura. Tente novamente.",
        defaultToastProps
      );
    } finally {
      setIsCancellingSubscription(false);
    }
  };

  const handleOpenCancelModal = () => {
    setIsConfirmCancelOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Scissors className="h-8 w-8 text-brand-primary" />
              <h1 className="text-3xl font-bold text-foreground">
                Gerenciar Assinatura - {establishment.name}
              </h1>
            </div>
            <p className="text-foreground-muted text-lg">
              Escolha o plano ideal para sua barbearia
            </p>
          </div>

          {isEstablishmentCanceled && (
            <Card className="border-2 border-red-500 bg-gradient-to-r from-red-500/5 to-red-700/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ShieldX className="h-5 w-5 text-red-500" />
                  <CardTitle className="text-red-500">
                    Plano {currentPlan?.name} cancelado
                  </CardTitle>
                </div>
                <CardDescription>
                  Faça parte novamente da nossa plataforma e aproveite todos os
                  recursos disponibilizados.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="default"
                  onClick={() => handlePlanChange(currentPlan?.id as number)}
                >
                  Reativar Plano
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-fill-color border border-color-border rounded-lg p-1">
              <Button
                variant={billingInterval === "monthly" ? "default" : "ghost"}
                size="sm"
                onClick={() => setBillingInterval("monthly")}
                className="px-6"
              >
                Mensal
              </Button>
              <Button
                variant={billingInterval === "annual" ? "default" : "ghost"}
                size="sm"
                onClick={() => setBillingInterval("annual")}
                className="px-6"
              >
                Anual
                <Badge variant="secondary" className="ml-2">
                  Economize 17%
                </Badge>
              </Button>
            </div>
          </div>

          <Card className="border-brand-primary/20 bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-brand-primary" />
                  <CardTitle className="text-foreground">
                    Plano Atual
                    {isEstablishmentCanceled && " (Cancelado)"}
                  </CardTitle>
                </div>
                <Badge size="lg">{currentPlan?.name}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    R$ {formatMoney(currentPlan?.price || 0)}
                    <span className="text-sm font-normal text-foreground-muted">
                      /
                      {currentPlan?.billingInterval === "annual"
                        ? "ano"
                        : "mês"}
                    </span>
                  </p>
                  {!isEstablishmentCanceled && establishment.nextBillingDate && (
                    <p className="text-sm text-foreground-muted">
                      Próxima cobrança em{" "}
                      {
                        intervalToDuration({
                          start: new Date(),
                          end: new Date(establishment.nextBillingDate),
                        }).days
                      }{" "}
                      dias
                    </p>
                  )}
                </div>
                {isEstablishmentCanceled ? (
                  <X className="h-8 w-8 text-red-500" />
                ) : (
                  <CheckCheck className="h-8 w-8 text-green-500" />
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-4">
            {filteredPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative transition-all duration-200 ${
                  popularPlan?.id === plan.id
                    ? "border-brand-primary shadow-lg scale-105"
                    : "hover:shadow-md hover:scale-102"
                } ${
                  popularPlan?.id === plan.id
                    ? "border-brand-secondary shadow-md"
                    : ""
                }`}
              >
                {popularPlan?.id === plan.id && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-brand-secondary text-foreground-on-secondary px-3 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}

                {currentPlan?.id === plan.id && !isEstablishmentCanceled && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-brand-primary text-foreground-on-primary px-3 py-1">
                      Atual
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="space-y-1">
                    {enterprisePlan?.id === plan.id ? (
                      <div>
                        <p className="text-2xl font-bold text-foreground">
                          Sob consulta
                        </p>
                        <p className="text-sm text-foreground-muted">
                          Preço personalizado
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-3xl font-bold text-foreground">
                          R$ {formatMoney(plan.price)}
                        </p>
                        <p className="text-sm text-foreground-muted">
                          por{" "}
                          {plan.billingInterval === "annual" ? "ano" : "mês"}
                        </p>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 flex flex-col h-full">
                  <p className="text-sm text-center text-font-secondary">
                    {plan.description}
                  </p>
                  <ul className="space-y-3 flex-1">
                    {enterprisePlan?.id !== plan.id && plan.maxWorkers && (
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-foreground-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">
                          Até {plan.maxWorkers} funcionários
                        </span>
                      </li>
                    )}
                    {plan.name === "Solo" && (
                      <>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-foreground-success mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-foreground">
                            Agendamento automatizado
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-foreground-success mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-foreground">
                            Gestão de serviços
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-foreground-success mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-foreground">
                            Relatórios básicos
                          </span>
                        </li>
                      </>
                    )}
                    {plan.hasPublicStorefront && (
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-foreground-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">
                          Vitrine digital pública
                        </span>
                      </li>
                    )}
                  </ul>
                  <Button
                    className="w-full mt-auto"
                    variant={
                      enterprisePlan?.id === plan.id
                        ? "outline"
                        : currentPlan?.id === plan.id &&
                          !isEstablishmentCanceled
                        ? "secondary"
                        : "default"
                    }
                    disabled={
                      currentPlan?.id === plan.id &&
                      !isEstablishmentCanceled
                    }
                    onClick={() =>
                      enterprisePlan?.id === plan.id
                        ? window.open(WHATSAPP_WEB_LINK, "_blank")
                        : handlePlanChange(plan.id)
                    }
                  >
                    {enterprisePlan?.id === plan.id
                      ? "Entrar em contato"
                      : isEstablishmentCanceled
                      ? "Ativar plano"
                      : currentPlan?.id === plan.id
                      ? "Plano Atual"
                      : plan.name === "Solo"
                      ? "Mudar para gratuito"
                      : "Mudar para este plano"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-4 justify-between">
            <Button variant="link" onClick={() => navigate(ROUTES.DASHBOARD)}>
              Voltar para o Dashboard
            </Button>
            {!isEstablishmentCanceled && (
              <Button
                variant="link"
                onClick={handleOpenCancelModal}
                className="text-red-600 hover:text-red-700"
              >
                Cancelar assinatura
              </Button>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        open={isConfirmCancelOpen}
        onOpenChange={setIsConfirmCancelOpen}
        title="Cancelar Assinatura"
        description="Tem certeza que deseja cancelar sua assinatura? Esta ação não pode ser desfeita e você perderá acesso aos recursos premium imediatamente."
        confirmText="Sim, cancelar assinatura"
        cancelText="Não, manter assinatura"
        onConfirm={handleCancelSubscription}
        variant="destructive"
        isLoading={isCancellingSubscription}
      />
    </DashboardLayout>
  );
}
