import { Card, CardContent, MaskedInput, ErrorMessage } from "@/components";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  codeSchema,
  registerUserSchema,
  type CodeFormData,
  type RegisterFormData,
} from "@/types/user";
import { MessageSquare, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCallback, useState } from "react";
import { formatToE164 } from "@/utils/formatter";
import { checkPhoneExists } from "@/utils/auth";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router";
import { ROUTES } from "@/constants";
import { useAuthRedirect } from "@/hooks/useAuth";

const RegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [registrationData, setRegistrationData] = useState<{
    name: string;
    phone: string;
    typeID: number;
  } | null>(null);
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
    <RegisterForm
      key="register"
      nextStep={nextStep}
      setRegistrationData={setRegistrationData}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
    />,
    <CodeInput
      key="code"
      prevStep={prevStep}
      registrationData={registrationData}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
    />,
  ];

  return (
    <div className="max-h-screen flex">
      <img src="/haircut-and-beard-combo-barber.jpg" alt="Image" className="" />
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

export default RegisterPage;

interface RegisterFormProps {
  nextStep: () => void;
  setRegistrationData: (data: {
    name: string;
    phone: string;
    typeID: number;
  }) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const RegisterForm = ({
  nextStep,
  setRegistrationData,
  isLoading,
  setIsLoading,
}: RegisterFormProps) => {
  const { control, handleSubmit, setError } = useForm<RegisterFormData>({
    resolver: zodResolver(registerUserSchema),
  });

  const { register } = useUser();
  const navigate = useNavigate();

  async function onSubmit(data: RegisterFormData) {
    try {
      setIsLoading(true);
      const formattedPhone = formatToE164(data.phone);

      // Verificar se o telefone já está cadastrado
      const phoneExists = await checkPhoneExists(formattedPhone);
      if (phoneExists) {
        setError("phone", {
          type: "manual",
          message: "Telefone já cadastrado. Faça login.",
        });
        return;
      }

      // Enviar OTP para o telefone
      await register(data.name, formattedPhone, 1); // typeID 1 = customer

      // Salvar dados do registro para usar após verificação
      setRegistrationData({
        name: data.name,
        phone: formattedPhone,
        typeID: 1,
      });

      nextStep();
    } catch (error) {
      console.error("Erro ao registrar:", error);
      setError("phone", {
        type: "manual",
        message: "Erro ao enviar código. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardContent>
        <div className="mb-6 space-y-1.5 text-center">
          <h2 className="text-2xl font-bold text-foreground">Crie sua conta</h2>
          <p className="text-sm text-font-secondary">
            Preencha seus dados para começar
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-foreground"
            >
              Nome completo
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    placeholder="João Silva"
                    id="name"
                    error={fieldState.invalid}
                    disabled={isLoading}
                  />
                  <ErrorMessage>{fieldState.error?.message}</ErrorMessage>
                </>
              )}
            />
          </div>

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
            <UserPlus />
            {isLoading ? "Criando conta..." : "Criar conta"}
          </Button>

          <div className="text-center text-sm text-font-secondary">
            Já tem uma conta?{" "}
            <button
              type="button"
              onClick={() => navigate(ROUTES.LOGIN)}
              className="text-primary hover:underline"
              disabled={isLoading}
            >
              Faça login
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

interface CodeInputProps {
  prevStep: () => void;
  registrationData: {
    name: string;
    phone: string;
    typeID: number;
  } | null;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const CodeInput = ({
  registrationData,
  isLoading,
  setIsLoading,
}: CodeInputProps) => {
  const { control, handleSubmit, setError } = useForm<CodeFormData>({
    resolver: zodResolver(codeSchema),
  });

  const navigate = useNavigate();
  const { verifyOtpAndCreateProfile } = useUser();

  async function onSubmit(data: CodeFormData) {
    try {
      if (!registrationData) {
        throw new Error("Dados de registro não encontrados");
      }

      setIsLoading(true);

      // Verificar OTP e criar perfil do usuário na API
      await verifyOtpAndCreateProfile(registrationData.phone, data.code, {
        name: registrationData.name,
        typeID: registrationData.typeID,
      });

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
          <h2 className="text-2xl font-bold text-foreground">
            Digite o código de verificação
          </h2>
          <p className="text-sm text-font-secondary">
            Insira o código enviado via SMS para o número{" "}
            {registrationData?.phone || ""}
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
