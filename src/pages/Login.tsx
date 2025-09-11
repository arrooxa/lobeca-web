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
import { config } from "@/utils";
import { supabase } from "@/utils/supabase";
import { sendOTP, verifyOTP } from "@/utils/auth";
import { userService } from "@/services";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router";
import { ROUTES } from "@/constants";

const Loginpage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPhone, setSelectedPhone] = useState("");

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => prev - 1);
  }, []);

  const STEPS = [
    <PhoneInput nextStep={nextStep} setSelectedPhone={setSelectedPhone} />,
    <CodeInput
      prevStep={prevStep}
      selectedPhone={selectedPhone}
      setSelectedPhone={setSelectedPhone}
    />,
  ];

  return (
    <div className="max-h-screen flex">
      <img src="/haircut-and-beard-combo-barber.jpg" alt="Image" className="" />
      <div className="flex flex-1 items-center justify-center p-6">
        {STEPS[currentStep]}
      </div>
    </div>
  );
};

export default Loginpage;

const PhoneInput = ({
  nextStep,
  setSelectedPhone,
}: {
  nextStep: () => void;
  setSelectedPhone: (phone: string) => void;
}) => {
  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    const formattedPhone = formatToE164(data.phone);

    if (!config.isDev) {
      const { data: exists } = await supabase.rpc("check_phone_exists", {
        phone_number: formattedPhone.slice(1), // Remove the leading '+' for the RPC call
      });

      if (!exists) {
        return console.error("Telefone não cadastrado");
      }
    }

    const response = await sendOTP(formattedPhone);

    if (response.error) {
      console.error("Erro ao enviar código:", response.error);

      return console.error(
        "Erro tentando enviar código para o número de telefone"
      );
    }

    setSelectedPhone(data.phone);

    return nextStep();
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
        <form className="space-y-4">
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
                  />
                  <ErrorMessage>{fieldState.error?.message}</ErrorMessage>
                </>
              )}
            />
          </div>
          <Button className="w-full" onClick={handleSubmit(onSubmit)}>
            <MessageSquare />
            Enviar código SMS
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const CodeInput = ({
  selectedPhone,
}: {
  prevStep: () => void;
  selectedPhone: string;
  setSelectedPhone: (phone: string) => void;
}) => {
  const { control, handleSubmit } = useForm<CodeFormData>({
    resolver: zodResolver(codeSchema),
  });

  const navigate = useNavigate();

  const { login } = useUser();

  async function onSubmit(data: CodeFormData) {
    const formattedPhone = formatToE164(selectedPhone);

    try {
      const response = await verifyOTP(formattedPhone, data.code);

      if (!response.data.user?.id) {
        return console.error("Falha na autenticação. Tente novamente.");
      }

      const supabaseID = response.data.user.id;

      const user = await userService.getUserBySupabaseId(supabaseID);

      await login(user);

      return navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (error) {
      console.error("Erro ao verificar código. Tente novamente.", error);
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
            Insira o código enviado via SMS para o número {selectedPhone}
          </p>
        </div>
        <form className="space-y-4">
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
                  />
                  <ErrorMessage>{fieldState.error?.message}</ErrorMessage>
                </>
              )}
            />
          </div>
          <Button className="w-full" onClick={handleSubmit(onSubmit)}>
            <MessageSquare />
            Enviar código SMS
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
