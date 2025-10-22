import { Card, CardContent, MaskedInput, ErrorMessage } from "@/components";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  codeSchema,
  loginSchema,
  type CodeFormData,
  type LoginFormData,
} from "@/types/user";
import { MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCallback, useState } from "react";
import { formatToE164 } from "@/utils/formatter";
import { checkPhoneExists } from "@/utils/auth";
import { useUser } from "@/context/UserContext";
import { NavLink, useNavigate } from "react-router";
import { ROUTES } from "@/constants";
import { useAuthRedirect } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";

const Loginpage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPhone, setSelectedPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated, isLoading: authLoading } = useAuthRedirect();

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => prev - 1);
  }, []);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  const STEPS = [
    <PhoneInput
      key="phone"
      nextStep={nextStep}
      setSelectedPhone={setSelectedPhone}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
    />,
    <CodeInput
      key="code"
      prevStep={prevStep}
      selectedPhone={selectedPhone}
      setSelectedPhone={setSelectedPhone}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
    />,
  ];

  return (
    <div className="min-h-screen grid md:grid-cols-2 grid-cols-1">
      <div className="relative hidden md:block">
        <img
          src="/haircut-and-beard-combo-barber.jpg"
          alt="Barber Shop"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-8 left-8 text-white">
          <h1 className="text-4xl font-bold mb-2 text-balance">
            Bem-vindo de volta!
          </h1>
          <p className="text-lg text-white/90">Entre para acessar sua conta</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 bg-fill-color/30">
        <div className="w-full max-w-md">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2">
              {[0, 1].map((step) => (
                <div
                  key={step}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    step === currentStep
                      ? "w-12 bg-brand-primary"
                      : "w-2 bg-brand-secondary"
                  )}
                />
              ))}
            </div>
          </div>

          {STEPS[currentStep]}
        </div>
      </div>
    </div>
  );
};

export default Loginpage;

interface PhoneInputProps {
  nextStep: () => void;
  setSelectedPhone: (phone: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const PhoneInput = ({
  nextStep,
  setSelectedPhone,
  isLoading,
  setIsLoading,
}: PhoneInputProps) => {
  const { control, handleSubmit, setError } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { loginWithOtp } = useUser();

  async function onSubmit(data: LoginFormData) {
    try {
      setIsLoading(true);
      const formattedPhone = formatToE164(data.phone);

      const phoneExists = await checkPhoneExists(formattedPhone);
      if (!phoneExists) {
        setError("phone", {
          type: "manual",
          message: "Telefone não cadastrado no sistema",
        });
        return;
      }

      await loginWithOtp(formattedPhone);

      setSelectedPhone(data.phone);
      nextStep();
    } catch (error) {
      console.error("Erro no envio do OTP:", error);
      setError("phone", {
        type: "manual",
        message: "Erro inesperado. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardContent className="pt-6">
        <div className="mb-6 space-y-2 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center mb-3">
            <MessageSquare className="h-6 w-6 text-brand-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Entre com seu telefone
          </h2>
          <p className="text-sm text-foreground-muted">
            Enviaremos um código de verificação via SMS
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-foreground"
            >
              Número de celular
            </label>
            <Controller
              name="phone"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <MaskedInput
                    {...field}
                    mask="(00) 00000-0000"
                    unmask={true}
                    onAccept={(value: string) => field.onChange(value)}
                    placeholder="(11) 99999-9999"
                    id="phone"
                    error={fieldState.invalid}
                    disabled={isLoading}
                    className="h-11"
                  />
                  <ErrorMessage>{fieldState.error?.message}</ErrorMessage>
                </>
              )}
            />
          </div>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Enviando...
              </>
            ) : (
              <>
                <MessageSquare className="h-4 w-4" />
                Enviar código SMS
              </>
            )}
          </Button>

          <div className="text-center text-sm text-foreground-muted pt-2">
            Não tem uma conta?{" "}
            <NavLink
              to={ROUTES.REGISTER}
              className="text-brand-primary hover:underline font-medium"
            >
              Registre-se
            </NavLink>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

interface CodeInputProps {
  prevStep: () => void;
  selectedPhone: string;
  setSelectedPhone: (phone: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const CodeInput = ({
  prevStep,
  selectedPhone,
  isLoading,
  setIsLoading,
}: CodeInputProps) => {
  const { control, handleSubmit, setError } = useForm<CodeFormData>({
    resolver: zodResolver(codeSchema),
  });

  const navigate = useNavigate();
  const { verifyOtp } = useUser();

  async function onSubmit(data: CodeFormData) {
    try {
      setIsLoading(true);
      const formattedPhone = formatToE164(selectedPhone);

      await verifyOtp(formattedPhone, data.code);

      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (error) {
      console.error("Erro ao verificar código:", error);
      setError("code", {
        type: "manual",
        message: "Erro ao verificar código. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="animate-in fade-in slide-in-from-right-4 duration-500">
      <CardContent className="pt-6">
        <div className="mb-6 space-y-2 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center mb-3">
            <MessageSquare className="h-6 w-6 text-brand-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Digite o código de verificação
          </h2>
          <p className="text-sm text-foreground-muted">
            Enviamos um código para{" "}
            <span className="font-medium text-foreground">{selectedPhone}</span>
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label
              htmlFor="code"
              className="block text-sm font-medium text-foreground"
            >
              Código de verificação
            </label>
            <Controller
              name="code"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    placeholder="000000"
                    id="code"
                    error={fieldState.invalid}
                    maxLength={6}
                    disabled={isLoading}
                    className="h-11 text-center text-2xl tracking-widest font-mono"
                  />
                  <ErrorMessage>{fieldState.error?.message}</ErrorMessage>
                </>
              )}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={isLoading}
              className="flex-1 bg-transparent"
            >
              Voltar
            </Button>
            <Button className="flex-1" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Verificando...
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4" />
                  Verificar
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
