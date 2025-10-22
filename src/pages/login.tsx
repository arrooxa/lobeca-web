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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
    <div className="h-screen grid md:grid-cols-2 grid-cols-1">
      <img
        src="/haircut-and-beard-combo-barber.jpg"
        alt="Image"
        className="hidden md:block"
      />
      {authLoading ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center p-6">
          {STEPS[currentStep]}
        </div>
      )}
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
    <Card>
      <CardContent>
        <div className="mb-6 space-y-1.5 text-center">
          <h2 className="text-2xl font-bold  text-foreground">
            Entre com seu telefone
          </h2>
          <p className="text-sm text-font-secondary">
            Enviaremos um código de verificação via SMS
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
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
                  />
                  <ErrorMessage>{fieldState.error?.message}</ErrorMessage>
                </>
              )}
            />
          </div>
          <Button className="w-full" type="submit" disabled={isLoading}>
            <MessageSquare />
            {isLoading ? "Enviando..." : "Enviar código SMS"}
          </Button>

          <div className="text-center text-sm text-font-secondary">
            Não tem uma conta?{" "}
            <NavLink
              to={ROUTES.REGISTER}
              className="text-primary hover:underline"
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

      // Verificar OTP usando o contexto
      await verifyOtp(formattedPhone, data.code);

      // Após verificação bem-sucedida, o onAuthStateChange do contexto
      // já vai carregar o perfil automaticamente

      // Navegar para dashboard
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
    <Card>
      <CardContent>
        <div className="mb-6 space-y-1.5 text-center">
          <h2 className="text-2xl font-bold  text-foreground">
            Digite o código de verificação
          </h2>
          <p className="text-sm text-font-secondary">
            Insira o código enviado via SMS para o número {selectedPhone}
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
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
                    placeholder="123456"
                    id="code"
                    error={fieldState.invalid}
                    maxLength={6}
                    disabled={isLoading}
                  />
                  <ErrorMessage>{fieldState.error?.message}</ErrorMessage>
                </>
              )}
            />
          </div>
          <Button className="w-full" type="submit" disabled={isLoading}>
            <MessageSquare />
            {isLoading ? "Verificando..." : "Verificar código"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
