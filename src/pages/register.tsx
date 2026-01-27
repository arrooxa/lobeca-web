import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { MessageSquare, UserPlus, Scissors, User, Check } from "lucide-react";
import { useCallback, useState } from "react";
import { cn } from "@/utils/cn";
import { ErrorMessage, MaskedInput } from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { codeSchema, registerUserSchema } from "@/types";
import { NavLink, useNavigate, useSearchParams } from "react-router";
import { ROUTES } from "@/constants";
import { formatToE164 } from "@/utils/formatter";
import { checkPhoneExists } from "@/utils/auth";
import { useUser } from "@/context/UserContext";

type RegisterFormData = {
  name: string;
  phone: string;
};

type CodeFormData = {
  code: string;
};

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const isFromApp = searchParams.get("source") === "app";

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedUserType, setSelectedUserType] = useState<number | null>(null);
  const [registrationData, setRegistrationData] = useState<{
    name: string;
    phone: string;
    typeID: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => prev - 1);
  }, []);

  const STEPS = [
    <UserTypeSelection
      key="user-type"
      nextStep={nextStep}
      selectedUserType={selectedUserType}
      setSelectedUserType={setSelectedUserType}
    />,
    <RegisterForm
      key="register"
      nextStep={nextStep}
      prevStep={prevStep}
      setRegistrationData={setRegistrationData}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      userType={selectedUserType}
    />,
    <CodeInput
      key="code"
      prevStep={prevStep}
      registrationData={registrationData}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      isFromApp={isFromApp}
    />,
  ];

  return (
    <div className="min-h-screen grid md:grid-cols-2 grid-cols-1">
      <div className="relative hidden md:block">
        <img
          src="/traditional-barber-haircut.jpg"
          alt="Barber Shop"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-8 left-8 text-white">
          <h1 className="text-4xl font-bold mb-2 text-balance">
            Bem-vindo ao Lobeca
          </h1>
          <p className="text-lg text-white/90">
            Conectando barbeiros e clientes
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 bg-fill-color/30">
        <div className="w-full max-w-md">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2">
              {[0, 1, 2].map((step) => (
                <div
                  key={step}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    step === currentStep
                      ? "w-12 bg-brand-primary"
                      : "w-2 bg-brand-secondary",
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

export default RegisterPage;

interface UserTypeSelectionProps {
  nextStep: () => void;
  selectedUserType: number | null;
  setSelectedUserType: (type: number) => void;
}

const UserTypeSelection = ({
  nextStep,
  selectedUserType,
  setSelectedUserType,
}: UserTypeSelectionProps) => {
  const handleSelect = (type: number) => {
    setSelectedUserType(type);
    // Auto-advance after selection with a small delay for visual feedback
    setTimeout(() => {
      nextStep();
    }, 300);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">
          Como você quer se cadastrar?
        </h2>
        <p className="text-foreground-on-primary">
          Escolha o tipo de conta que melhor se adequa a você
        </p>
      </div>

      <div className="grid gap-4">
        <button
          onClick={() => handleSelect(2)}
          className={cn(
            "group relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
            selectedUserType === 2
              ? "border-brand-primary bg-brand-primary/20 shadow-lg shadow-brand-primary/20"
              : "border-border bg-fill-color border-brand-primary/5 shadow-md",
          )}
        >
          <div className="p-6 flex items-start gap-4">
            <div
              className={cn(
                "rounded-full p-3 transition-colors duration-300",
                selectedUserType === 2
                  ? "bg-brand-primary text-foreground-on-primary"
                  : "bg-brand-primary/10 text-foreground-on-primary group-hover:bg-brand-primary group-hover:text-foreground-on-primary",
              )}
            >
              <Scissors className="h-6 w-6" />
            </div>

            <div className="flex-1 text-left">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xl font-semibold text-foreground">
                  Sou Barbeiro
                </h3>
                {selectedUserType === 2 && (
                  <div className="rounded-full bg-brand-primary p-1 animate-in zoom-in duration-200">
                    <Check className="h-4 w-4 text-foreground-on-primary" />
                  </div>
                )}
              </div>
              <p className="text-sm text-foreground-muted">
                Gerencie sua agenda, atenda clientes e expanda seu negócio
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-brand-primary text-foreground-on-primary">
                  Agenda online
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-brand-primary text-foreground-on-primary">
                  Gestão de clientes
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-brand-primary text-foreground-on-primary">
                  Pagamentos
                </span>
              </div>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleSelect(1)}
          className={cn(
            "group relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
            selectedUserType === 1
              ? "border-brand-primary bg-brand-primary/20 shadow-lg shadow-brand-primary/20"
              : "border-border bg-fill-color border-brand-primary/5 shadow-md",
          )}
        >
          <div className="p-6 flex items-start gap-4">
            <div
              className={cn(
                "rounded-full p-3 transition-colors duration-300",
                selectedUserType === 1
                  ? "bg-brand-primary text-foreground-on-primary"
                  : "bg-brand-primary/10 text-foreground-on-primary group-hover:bg-brand-primary group-hover:text-foreground-on-primary",
              )}
            >
              <User className="h-6 w-6" />
            </div>

            <div className="flex-1 text-left">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xl font-semibold text-foreground">
                  Sou Cliente
                </h3>
                {selectedUserType === 1 && (
                  <div className="rounded-full bg-brand-primary p-1 animate-in zoom-in duration-200">
                    <Check className="h-4 w-4 text-foreground-on-primary" />
                  </div>
                )}
              </div>
              <p className="text-sm text-foreground-muted">
                Agende cortes, encontre barbeiros e gerencie seus agendamentos
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-brand-primary text-foreground-on-primary">
                  Agendamento fácil
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-brand-primary text-foreground-on-primary">
                  Histórico
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-brand-primary text-foreground-on-primary">
                  Avaliações
                </span>
              </div>
            </div>
          </div>
        </button>
      </div>

      <p className="text-center text-xs text-foreground-subtle">
        Você não poderá alterar o tipo de conta posteriormente
      </p>
    </div>
  );
};

interface RegisterFormProps {
  nextStep: () => void;
  prevStep: () => void;
  setRegistrationData: (data: {
    name: string;
    phone: string;
    typeID: number;
  }) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  userType: number | null;
}

const RegisterForm = ({
  nextStep,
  prevStep,
  setRegistrationData,
  isLoading,
  setIsLoading,
  userType,
}: RegisterFormProps) => {
  const { control, handleSubmit, setError } = useForm<RegisterFormData>({
    resolver: zodResolver(registerUserSchema),
  });
  const { register } = useUser();

  async function onSubmit(data: RegisterFormData) {
    if (!userType) return;

    try {
      setIsLoading(true);

      const formattedPhone = formatToE164(data.phone);

      const phoneExists = await checkPhoneExists(formattedPhone);
      if (phoneExists) {
        setError("phone", {
          type: "manual",
          message: "Telefone já cadastrado. Faça login.",
        });
        return;
      }

      await register(data.name, formattedPhone, userType);

      setRegistrationData({
        name: data.name,
        phone: formattedPhone,
        typeID: userType,
      });

      nextStep();
    } catch (error) {
      console.error("Erro ao registrar:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="animate-in fade-in slide-in-from-right-4 duration-500">
      <CardContent className="pt-6">
        <div className="mb-6 space-y-2 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center mb-3">
            {userType === 2 ? (
              <Scissors className="h-6 w-6 text-brand-primary" />
            ) : (
              <User className="h-6 w-6 text-brand-primary" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-foreground">Crie sua conta</h2>
          <p className="text-sm text-foreground-muted">
            {userType === 2
              ? "Cadastro como Barbeiro"
              : "Cadastro como Cliente"}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
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
                    disabled={isLoading}
                    className="h-11"
                    error={fieldState.invalid}
                  />
                  <ErrorMessage>{fieldState.error?.message}</ErrorMessage>
                </>
              )}
            />
          </div>

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
                  Criando...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Continuar
                </>
              )}
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground pt-2">
            Já tem uma conta?{" "}
            <NavLink
              to={ROUTES.LOGIN}
              className="text-primary hover:underline font-medium"
            >
              Faça login
            </NavLink>
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
  isFromApp?: boolean;
}

const CodeInput = ({
  prevStep,
  registrationData,
  isLoading,
  setIsLoading,
  isFromApp,
}: CodeInputProps) => {
  const { control, handleSubmit } = useForm<CodeFormData>({
    resolver: zodResolver(codeSchema),
  });

  const { verifyOtpAndCreateProfile } = useUser();
  const navigate = useNavigate();

  async function onSubmit(data: CodeFormData) {
    try {
      if (!registrationData) {
        throw new Error("Dados de registro não encontrados");
      }

      setIsLoading(true);

      await verifyOtpAndCreateProfile(registrationData.phone, data.code, {
        name: registrationData.name,
        typeID: registrationData.typeID,
      });

      if (isFromApp) {
        const callbackUrl = `${ROUTES.APP_CALLBACK}?phone=${encodeURIComponent(registrationData.phone)}`;
        navigate(callbackUrl, { replace: true });
      } else {
        navigate(ROUTES.DASHBOARD, { replace: true });
      }
    } catch (error) {
      console.error("Erro ao verificar código:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="animate-in fade-in slide-in-from-right-4 duration-500">
      <CardContent className="pt-6">
        <div className="mb-6 space-y-2 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Verificação de código
          </h2>
          <p className="text-sm text-muted-foreground">
            Enviamos um código para{" "}
            <span className="font-medium text-foreground">
              {registrationData?.phone || "seu telefone"}
            </span>
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
                    maxLength={6}
                    disabled={isLoading}
                    className="h-11 text-center text-2xl tracking-widest font-mono"
                    error={fieldState.invalid}
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
                  <Check className="h-4 w-4" />
                  Verificar
                </>
              )}
            </Button>
          </div>

          {/* <div className="text-center pt-2">
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              disabled={isLoading}
            >
              Não recebeu o código?{" "}
              <span className="text-primary font-medium">Reenviar</span>
            </button>
          </div> */}
        </form>
      </CardContent>
    </Card>
  );
};
