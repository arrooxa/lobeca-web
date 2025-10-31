import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/dashboard";
import { LoadingBarber } from "@/components/ui";
import { useGetCurrentUserEstablishment } from "@/services/establishments/queries";
import {
  useGetSubscriptionsPlans,
  useCreateCheckoutSession,
  useUpdateCheckoutSession,
} from "@/services/subscriptions/queries";
import { checkoutParamsSchema } from "@/types";
import { useNavigate, useSearchParams } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  Lock,
  Shield,
} from "lucide-react";
import { formatMoney } from "@/utils/money";
import { toast } from "react-toastify";
import { defaultToastProps } from "@/constants";

const SubscriptionCheckout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

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

  const createCheckoutMutation = useCreateCheckoutSession();
  const updateCheckoutMutation = useUpdateCheckoutSession();

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

  const handleCheckout = async () => {
    if (!establishment || !currentPlan || !params) return;

    setIsProcessing(true);

    try {
      const baseUrl = window.location.origin;
      const successUrl = `${baseUrl}/dashboard/barbearia/assinatura/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${baseUrl}/dashboard/barbearia/assinatura`; // Redireciona para o dashboard principal

      const hasActiveSubscription =
        establishment.externalSubscriptionID &&
        establishment.externalCustomerID;

      const response = hasActiveSubscription
        ? await updateCheckoutMutation.mutateAsync({
            establishment_id: establishment.id,
            plan_id: currentPlan.id,
            success_url: successUrl,
            cancel_url: cancelUrl,
          })
        : await createCheckoutMutation.mutateAsync({
            establishment_id: establishment.id,
            plan_id: currentPlan.id,
            success_url: successUrl,
            cancel_url: cancelUrl,
          });

      // Redireciona para o checkout do Stripe
      window.location.href = response.session_url;
    } catch (error) {
      console.error("Erro ao criar checkout session:", error);

      let errorMessage = "Erro ao iniciar processo de pagamento";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, defaultToastProps);
      setIsProcessing(false);
    }
  };

  if (!params || isLoadingEstablishment || isLoadingPlans) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingBarber size="lg" />
        </div>
      </DashboardLayout>
    );
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

  const hasActiveSubscription =
    establishment.externalSubscriptionID && establishment.externalCustomerID;

  console.log("Rendering SubscriptionCheckout for plan:", establishment);

  return (
    <DashboardLayout>
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">
              {hasActiveSubscription
                ? "Alterar Assinatura"
                : "Finalizar Assinatura"}{" "}
              - {establishment.name}
            </h1>
            <p className="text-foreground-muted mt-2">
              {hasActiveSubscription
                ? "Você será redirecionado para o checkout seguro do Stripe para alterar seu plano"
                : "Você será redirecionado para o checkout seguro do Stripe para completar o pagamento"}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="border-color-border">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-foreground-accent" />
                    <CardTitle>Checkout Seguro</CardTitle>
                  </div>
                  <CardDescription>
                    Processamento de pagamento gerenciado pelo Stripe
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-fill-color p-6 rounded-lg border border-color-border">
                    <div className="flex items-center space-x-3 mb-4">
                      <Shield className="h-6 w-6 text-foreground-success" />
                      <span className="font-semibold text-foreground text-lg">
                        Pagamento 100% Seguro
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-foreground-muted">
                      <div className="flex items-center space-x-2">
                        <Lock className="h-4 w-4 text-foreground-success" />
                        <span>Criptografia SSL 256-bit</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-foreground-success" />
                        <span>PCI DSS Certificado</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-foreground-success" />
                        <span>Processado pelo Stripe</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-foreground-success" />
                        <span>Proteção antifraude</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground">
                      O que acontece agora?
                    </h3>
                    <ol className="space-y-2 text-sm text-foreground-muted">
                      <li className="flex items-start space-x-2">
                        <span className="font-semibold text-foreground-accent">
                          1.
                        </span>
                        <span>
                          Você será redirecionado para a página de checkout do
                          Stripe
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="font-semibold text-foreground-accent">
                          2.
                        </span>
                        <span>
                          Preencha as informações do seu cartão de crédito
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="font-semibold text-foreground-accent">
                          3.
                        </span>
                        <span>Confirme o pagamento e aguarde a aprovação</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="font-semibold text-foreground-accent">
                          4.
                        </span>
                        <span>
                          Após aprovação, você será redirecionado de volta ao
                          app
                        </span>
                      </li>
                    </ol>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-brand-primary hover:bg-brand-primary/90 text-foreground-on-primary"
                    disabled={isProcessing}
                    size="lg"
                  >
                    {isProcessing ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-foreground-on-primary"></div>
                        <span>Redirecionando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Lock className="h-4 w-4" />
                        <span>Ir para o Checkout Seguro</span>
                      </div>
                    )}
                  </Button>

                  <p className="text-xs text-center text-foreground-muted">
                    Ao continuar, você concorda com nossos{" "}
                    <a href="/terms-of-service" className="underline">
                      Termos de Serviço
                    </a>{" "}
                    e{" "}
                    <a href="/privacy-policy" className="underline">
                      Política de Privacidade
                    </a>
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-color-border">
                <CardHeader>
                  <CardTitle>Resumo da Assinatura</CardTitle>
                  <CardDescription>Plano {currentPlan.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground">
                      Plano {currentPlan.name}
                    </span>
                    <span className="font-semibold">
                      R$ {formatMoney(currentPlan.price)}
                    </span>
                  </div>

                  {currentPlan.maxWorkers && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-foreground-muted">
                        Máximo de profissionais
                      </span>
                      <span className="font-medium">
                        {currentPlan.maxWorkers}
                      </span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>R$ {formatMoney(currentPlan.price)}</span>
                  </div>

                  <Badge
                    variant="outline"
                    className="w-full justify-center py-4"
                  >
                    Cobrança{" "}
                    {currentPlan.billingInterval === "monthly"
                      ? "mensal"
                      : "anual"}{" "}
                    recorrente
                  </Badge>

                  {hasActiveSubscription && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-xs text-yellow-800">
                        <strong>Atenção:</strong> Sua assinatura atual será
                        cancelada e substituída pelo novo plano.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="bg-white border border-color-border rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-foreground-info mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-foreground-on-tertiary mb-1">
                      Seus dados estão protegidos
                    </p>
                    <p className="text-foreground-on-tertiary">
                      O processamento de pagamento é realizado diretamente pelo
                      Stripe, líder global em segurança de pagamentos online.
                      Seus dados de cartão nunca passam pelos nossos servidores.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionCheckout;
