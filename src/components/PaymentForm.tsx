import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Input } from "./ui";
import { CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  Eye,
  EyeOff,
  Lock,
  Shield,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import {
  paymentFormSchema,
  type EstablishmentWithSubscriptions,
  type PaymentFormData,
  type SubscriptionPlan,
} from "@/types";
import {
  useCreateSubscription,
  useUpdateSubscription,
} from "@/services/subscriptions/queries";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import {
  formatCardNumber,
  formatExpiryDate,
  tokenizeFormData,
} from "@/utils/pagarme";
import { defaultToastProps, ROUTES } from "@/constants";

interface PaymentFormProps {
  establishment: EstablishmentWithSubscriptions;
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
  const [showCvv, setShowCvv] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    mode: "onChange",
  });

  const createSubscriptionMutation = useCreateSubscription();
  const updateSubscriptionMutation = useUpdateSubscription();

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) {
      setValue("cardNumber", formatted, { shouldValidate: true });
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) {
      setValue("expiryDate", formatted, { shouldValidate: true });
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setValue("cvv", value, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: PaymentFormData) => {
    setIsProcessing(true);

    try {
      const cardToken = await tokenizeFormData(data);

      if (externalCustomerId && externalSubscriptionId) {
        await updateSubscriptionMutation.mutateAsync({
          establishment_id: establishment.id,
          plan_id: plan.id,
          card_token: cardToken,
          cpf: data.cpf,
        });
      } else {
        await createSubscriptionMutation.mutateAsync({
          establishment_id: establishment.id,
          plan_id: plan.id,
          card_token: cardToken,
          cpf: data.cpf,
        });
      }

      toast.success("Assinatura criada com sucesso!", defaultToastProps);

      navigate(ROUTES.DASHBOARD_SUBSCRIPTION_SUCCESS, { replace: true });
    } catch (error) {
      console.error(error);

      let errorMessage = "Erro ao processar pagamento";

      if (error instanceof Error) {
        if (
          error.message.includes("tokenização") ||
          error.message.includes("cartão")
        ) {
          errorMessage = error.message;
        } else if (error.message.includes("sistema de pagamento")) {
          errorMessage = error.message;
        } else if (error.message.includes("conexão")) {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage, defaultToastProps);
    } finally {
      setIsProcessing(false);
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
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Número do Cartão</Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      {...register("cardNumber")}
                      onChange={handleCardNumberChange}
                      className="text-lg tracking-wider pr-12"
                    />
                  </div>
                  {errors.cardNumber && (
                    <p className="text-sm text-red-600">
                      {errors.cardNumber.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardholderName">Nome do Titular</Label>
                  <Input
                    id="cardholderName"
                    type="text"
                    placeholder="João Silva"
                    {...register("cardholderName")}
                  />
                  {errors.cardholderName && (
                    <p className="text-sm text-red-600">
                      {errors.cardholderName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    type="text"
                    placeholder="123.456.789-09"
                    {...register("cpf")}
                  />
                  {errors.cpf && (
                    <p className="text-sm text-red-600">{errors.cpf.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Data de Validade</Label>
                    <Input
                      id="expiryDate"
                      type="text"
                      placeholder="MM/AA"
                      {...register("expiryDate")}
                      onChange={handleExpiryChange}
                    />
                    {errors.expiryDate && (
                      <p className="text-sm text-red-600">
                        {errors.expiryDate.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <div className="relative">
                      <Input
                        id="cvv"
                        type={showCvv ? "text" : "password"}
                        placeholder="123"
                        {...register("cvv")}
                        onChange={handleCvvChange}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCvv(!showCvv)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
                      >
                        {showCvv ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.cvv && (
                      <p className="text-sm text-red-600">
                        {errors.cvv.message}
                      </p>
                    )}
                  </div>
                </div>

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
                    isProcessing || createSubscriptionMutation.isPending
                  }
                  size="lg"
                >
                  {isProcessing || createSubscriptionMutation.isPending ? (
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
                  R$ {plan.price.toFixed(2)}
                </span>
              </div>

              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>R$ {plan.price.toFixed(2)}</span>
              </div>
              <Badge variant="outline" className="w-full justify-center py-4">
                Cobrança mensal recorrente
              </Badge>
            </CardContent>
          </Card>

          {/* Aviso de Segurança */}
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
