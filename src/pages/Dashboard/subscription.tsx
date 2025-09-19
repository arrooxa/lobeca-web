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
import {
  Crown,
  Scissors,
  Star,
  Users,
  Clock,
  Check,
  CheckCheck,
} from "lucide-react";
import DashboardLayout from "@/layouts/dashboard";
import { useGetCurrentUserEstablishment } from "@/services/establishments/queries";
import {
  useCreateSubscription,
  useGetSubscriptionsPlans,
} from "@/services/subscriptions/queries";
import { cn } from "@/utils/cn";

export default function SubscriptionPage() {
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

  const createSubscriptionMutation = useCreateSubscription();

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
    establishment.establishment.status === "trial" &&
    !establishment.establishment.lastPaymentDate;

  const trialDaysLeft =
    isEstablishmentTrialing && establishment.establishment.trialEndsAt
      ? Math.ceil(
          (new Date(establishment.establishment.trialEndsAt).getTime() -
            Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const trialProgress = ((30 - trialDaysLeft) / 30) * 100;

  const currentPlan = plans.find(
    (p) => p.id === establishment.establishment.planID
  );

  const popularPlan = plans.find((p) => p.id === 2);

  const enterprisePlan = plans.find((p) => p.maxWorkers === undefined);

  const handlePlanChange = async (planId: number) => {
    console.log("Change to plan ID:", planId);

    const response = await createSubscriptionMutation.mutateAsync({
      establishmentId: establishment.establishment.id,
      planId,
    });

    if (response.checkout_url) {
      window.location.href = response.checkout_url;
    }
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
                Gerenciar Assinatura
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

          <Card className="border-brand-primary/20 bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-brand-primary" />
                  <CardTitle className="text-foreground">Plano Atual</CardTitle>
                </div>
                <Badge size="lg">{currentPlan?.name}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    R$ {currentPlan?.price.toFixed(2).replace(".", ",")}
                    <span className="text-sm font-normal text-foreground-muted">
                      /mês
                    </span>
                  </p>
                  <p className="text-sm text-foreground-muted">
                    Próxima cobrança em 23 dias
                  </p>
                </div>
                <CheckCheck className="h-8 w-8 text-green-500" />
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

                {currentPlan?.id === plan.id && (
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
                          R$ {plan.price.toFixed(2).replace(".", ",")}
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
                      currentPlan?.id === plan.id
                        ? "secondary"
                        : enterprisePlan?.id === plan.id
                        ? "outline"
                        : "default"
                    }
                    disabled={
                      currentPlan?.id === plan.id ||
                      createSubscriptionMutation.isPending
                    }
                    onClick={() => handlePlanChange(plan.id)}
                  >
                    {createSubscriptionMutation.isPending
                      ? "Processando..."
                      : enterprisePlan?.id === plan.id
                      ? "Entrar em contato"
                      : currentPlan?.id === plan.id
                      ? "Plano Atual"
                      : "Mudar para este plano"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Informações Importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">
                    Upgrade de Plano
                  </h4>
                  <p className="text-sm text-foreground-muted">
                    Ao fazer upgrade, você terá acesso imediato aos novos
                    recursos. A cobrança será proporcional ao período restante.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">
                    Downgrade de Plano
                  </h4>
                  <p className="text-sm text-foreground-muted">
                    O downgrade será efetivado no próximo ciclo de cobrança.
                    Você manterá os recursos atuais até lá.
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-xs text-foreground-muted text-center">
                  Plano Starter inclui 30 dias de teste gratuito • Cancele a
                  qualquer momento • Suporte em português
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
