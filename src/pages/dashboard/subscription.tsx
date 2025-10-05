import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import {
  Crown,
  Scissors,
  Star,
  Clock,
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

  const isEstablishmentTrialing =
    establishment.status === "trial" && !establishment.lastPaymentDate;

  const isEstablishmentCanceled = establishment.status === "canceled";

  const trialDaysLeft =
    isEstablishmentTrialing && establishment.trialEndsAt
      ? intervalToDuration({
          start: new Date(),
          end: new Date(establishment.trialEndsAt),
        }).days || 0
      : 0;

  const trialProgress = ((30 - trialDaysLeft) / 30) * 100;

  const currentPlan = plans.find((p) => p.id === establishment.planID);

  const popularPlan = plans.find((p) => p.id === 2);

  const enterprisePlan = plans.find((p) => p.maxWorkers === undefined);

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
        establishmentId: establishment.id,
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

  const getTrialCardColor = () => {
    if (trialDaysLeft >= 20)
      return "border-yellow-500 bg-gradient-to-r from-yellow-500/5 to-orange-500/5";
    if (trialDaysLeft >= 10)
      return "border-orange-500 bg-gradient-to-r from-orange-500/5 to-red-500/5";
    return "border-brand-secondary bg-gradient-to-r from-red-500/5 to-red-700/5";
  };

  const getTrialCardTextColor = () => {
    if (trialDaysLeft >= 20) return "text-yellow-500";
    if (trialDaysLeft >= 10) return "text-orange-500";
    return "text-red-500";
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

          {isEstablishmentTrialing && (
            <Card className={cn("border-2", getTrialCardColor())}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className={cn("h-5 w-5", getTrialCardTextColor())} />
                  <CardTitle className={getTrialCardTextColor()}>
                    Período de Teste Ativo
                  </CardTitle>
                </div>
                <CardDescription>
                  Você tem {trialDaysLeft} dias restantes no seu período de
                  teste gratuito
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso do trial</span>
                    <span>{Math.round(trialProgress)}%</span>
                  </div>
                  <Progress value={trialProgress} className="h-2" />
                </div>
                <p className="text-sm text-foreground-muted">
                  Após o período de teste, você será automaticamente direcionado
                  para o plano Starter.
                </p>
              </CardContent>
            </Card>
          )}

          {isEstablishmentCanceled && (
            <Card className={cn("border-2", getTrialCardColor())}>
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

          <Card className="border-brand-primary/20 bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-brand-primary" />
                  <CardTitle className="text-foreground">
                    Plano Atual{" "}
                    {isEstablishmentTrialing && "(Período de Teste)"}
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
                      /mês
                    </span>
                  </p>
                  {!isEstablishmentTrialing && !isEstablishmentCanceled && (
                    <p className="text-sm text-foreground-muted">
                      Próxima cobrança em{" "}
                      {
                        intervalToDuration({
                          start: new Date(),
                          end: new Date(establishment.nextBillingDate || ""),
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
            {plans.map((plan) => (
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
                        <p className="text-sm text-foreground-muted">por mês</p>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 flex flex-col h-full">
                  <p className="text-sm text-center text-font-secondary">
                    {plan.description}
                  </p>
                  <ul className="space-y-3 flex-1">
                    {enterprisePlan?.id != plan.id && (
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-foreground-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">
                          Até {plan.maxWorkers} funcionários
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
                          !isEstablishmentTrialing &&
                          !isEstablishmentCanceled
                        ? "secondary"
                        : "default"
                    }
                    disabled={
                      currentPlan?.id === plan.id &&
                      !isEstablishmentTrialing &&
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
                      : isEstablishmentTrialing || isEstablishmentCanceled
                      ? "Ativar plano"
                      : currentPlan?.id === plan.id
                      ? "Plano Atual"
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
            {!isEstablishmentTrialing && (
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
