import React, { useState, useEffect, useRef } from "react";
import { Button, Card } from "./ui";
import { CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  Lock,
  Shield,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import {
  type EstablishmentWithSubscription,
  type SubscriptionPlan,
} from "@/types";
import {
  useCreateSubscription,
  useUpdateSubscription,
} from "@/services/subscriptions/queries";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import {
  createCardForm,
  type MercadoPagoCardForm,
  type MercadoPagoCardFormData,
} from "@/utils/mercadopago";
import { defaultToastProps, ROUTES } from "@/constants";
import { formatMoney } from "@/utils/money";

interface PaymentFormProps {
  establishment: EstablishmentWithSubscription;
  plan: SubscriptionPlan;
  externalCustomerId?: string;
  externalSubscriptionId?: string;
}

const PaymentForm = ({
  establishment,
  plan,
  externalCustomerId,
  externalSubscriptionId,
}: PaymentFormProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardFormInstance, setCardFormInstance] =
    useState<MercadoPagoCardForm | null>(null);
  const [isFormReady, setIsFormReady] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  const createSubscriptionMutation = useCreateSubscription();
  const updateSubscriptionMutation = useUpdateSubscription();

  useEffect(() => {
    let mounted = true;

    const initializeCardForm = async () => {
      try {
        const cardForm = await createCardForm(
          plan.price.toString(),
          async (token: string, cardFormData: MercadoPagoCardFormData) => {
            if (!mounted) return;

            try {
              setIsProcessing(true);

              if (externalCustomerId && externalSubscriptionId) {
                await updateSubscriptionMutation.mutateAsync({
                  establishment_id: establishment.id,
                  plan_id: plan.id,
                  card_token: token,
                  cpf: cardFormData.identificationNumber,
                });
              } else {
                await createSubscriptionMutation.mutateAsync({
                  establishment_id: establishment.id,
                  plan_id: plan.id,
                  card_token: token,
                  cpf: cardFormData.identificationNumber,
                });
              }

              toast.success("Assinatura criada com sucesso!", defaultToastProps);
              navigate(ROUTES.DASHBOARD_SUBSCRIPTION_SUCCESS, { replace: true });
            } catch (error) {
              console.error("Erro ao processar assinatura:", error);

              let errorMessage = "Erro ao processar pagamento";

              if (error instanceof Error) {
                errorMessage = error.message;
              }

              toast.error(errorMessage, defaultToastProps);
            } finally {
              setIsProcessing(false);
            }
          },
          (error: Error) => {
            if (!mounted) return;
            console.error("Erro no CardForm:", error);
            toast.error(
              "Erro ao configurar formulário de pagamento",
              defaultToastProps
            );
          }
        );

        if (mounted) {
          setCardFormInstance(cardForm);
          setIsFormReady(true);
        }
      } catch (error) {
        if (mounted) {
          console.error("Erro ao inicializar CardForm:", error);
          toast.error(
            "Erro ao carregar formulário de pagamento",
            defaultToastProps
          );
        }
      }
    };

    initializeCardForm();

    return () => {
      mounted = false;
      if (cardFormInstance) {
        try {
          cardFormInstance.unmount();
        } catch (error) {
          console.error("Erro ao desmontar CardForm:", error);
        }
      }
    };
  }, [plan.price, establishment.id, plan.id, externalCustomerId, externalSubscriptionId, createSubscriptionMutation, updateSubscriptionMutation, navigate, cardFormInstance]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!isFormReady || !cardFormInstance) {
      toast.error("Formulário ainda não está pronto", defaultToastProps);
      return;
    }
  };

  return (
    <div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border-color-border">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-foreground-accent" />
                <CardTitle>Informações do Cartão</CardTitle>
              </div>
              <CardDescription>
                Seus dados são protegidos com criptografia de ponta a ponta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                id="mercadopago-form"
                ref={formRef}
                onSubmit={onSubmit}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="form-checkout__cardNumber">
                    Número do Cartão
                  </Label>
                  <div id="form-checkout__cardNumber" className="mp-field"></div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="form-checkout__cardholderName">
                    Nome do Titular
                  </Label>
                  <input
                    id="form-checkout__cardholderName"
                    name="cardholderName"
                    type="text"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="form-checkout__cardholderEmail">E-mail</Label>
                  <input
                    id="form-checkout__cardholderEmail"
                    name="cardholderEmail"
                    type="email"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="form-checkout__expirationDate">
                      Data de Validade
                    </Label>
                    <div
                      id="form-checkout__expirationDate"
                      className="mp-field"
                    ></div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="form-checkout__securityCode">CVV</Label>
                    <div
                      id="form-checkout__securityCode"
                      className="mp-field"
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="form-checkout__identificationType">
                    Tipo de Documento
                  </Label>
                  <select
                    id="form-checkout__identificationType"
                    name="identificationType"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="form-checkout__identificationNumber">
                    CPF
                  </Label>
                  <input
                    id="form-checkout__identificationNumber"
                    name="identificationNumber"
                    type="text"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <select
                  id="form-checkout__issuer"
                  name="issuer"
                  style={{ display: "none" }}
                />
                <select
                  id="form-checkout__installments"
                  name="installments"
                  style={{ display: "none" }}
                />

                <Separator />

                <div className="bg-fill-color p-4 rounded-lg border border-color-border">
                  <div className="flex items-center space-x-2 mb-3">
                    <Shield className="h-5 w-5 text-foreground-success" />
                    <span className="font-semibold text-foreground">
                      Pagamento 100% Seguro
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-foreground-muted">
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4 text-foreground-success" />
                      <span>Criptografia SSL 256-bit</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-foreground-success" />
                      <span>Dados não armazenados</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-foreground-success" />
                      <span>Certificado PCI DSS</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-foreground-success" />
                      <span>Proteção antifraude</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-brand-primary hover:bg-brand-primary/90 text-foreground-on-primary"
                  disabled={
                    !isFormReady ||
                    isProcessing ||
                    createSubscriptionMutation.isPending
                  }
                  size="lg"
                >
                  {!isFormReady ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-foreground-on-primary"></div>
                      <span>Carregando formulário...</span>
                    </div>
                  ) : isProcessing || createSubscriptionMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-foreground-on-primary"></div>
                      <span>Processando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4" />
                      <span>Finalizar Pagamento</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-color-border">
            <CardHeader>
              <CardTitle>Resumo da Assinatura</CardTitle>
              <CardDescription>Plano {plan.name} mensal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-foreground">Plano {plan.name}</span>
                <span className="font-semibold">
                  R$ {formatMoney(plan.price)}
                </span>
              </div>

              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>R$ {formatMoney(plan.price)}</span>
              </div>
              <Badge variant="outline" className="w-full justify-center py-4">
                Cobrança mensal recorrente
              </Badge>
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
                  Utilizamos as mais avançadas tecnologias de segurança. Seus
                  dados de pagamento são criptografados e nunca armazenados em
                  nossos servidores.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
