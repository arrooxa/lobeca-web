import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useCreateAppointment,
  useUpdateAppointment,
} from "@/services/appointments/queries";
import { formatMoney } from "@/utils/money";
import { CheckCircle2, User as UserIcon, Lock } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useUser } from "@/context/UserContext";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUserSchema } from "@/types";
import type { z } from "zod";
import { ErrorMessage, MaskedInput } from "@/components";
import { formatToE164 } from "@/utils/formatter";
import { toast } from "react-toastify";
import { ROUTES } from "@/constants";
import type { PublicWorkerWithDetails } from "@/types";

interface ConfirmationStepProps {
  worker: PublicWorkerWithDetails;
  serviceID: string;
  date: string;
  time: string;
  appointmentUUID: string | null;
}

type RegisterFormData = z.infer<typeof registerUserSchema>;

const ConfirmationStep = ({
  worker,
  serviceID,
  date,
  time,
  appointmentUUID,
}: ConfirmationStepProps) => {
  const { workerUUID } = useParams<{ workerUUID: string }>();
  const navigate = useNavigate();

  const { user, isAuthenticated, register, verifyOtpAndCreateProfile } =
    useUser();
  const [showRegisterForm, setShowRegisterForm] = useState(!isAuthenticated);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [registrationPhone, setRegistrationPhone] = useState("");
  const [registrationName, setRegistrationName] = useState("");

  const selectedDate = date
    ? parse(date, "yyyy-MM-dd", new Date())
    : new Date();
  const dateTimeString = `${date}T${time}:00`;
  const appointmentDateTime = new Date(dateTimeString);

  const createAppointmentMutation = useCreateAppointment();
  const updateAppointmentMutation = useUpdateAppointment();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerUserSchema),
  });

  const {
    control: otpControl,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm<{ code: string }>();

  const selectedService = worker.services?.find(
    (service) => service.id === Number(serviceID)
  );

  if (!selectedService) {
    return null;
  }

  const handleConfirmAppointment = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Você precisa estar logado para confirmar o agendamento");
      return;
    }

    try {
      if (appointmentUUID) {
        await updateAppointmentMutation.mutateAsync({
          appointmentUUID,
          workerUUID: workerUUID || "",
          data: {
            workerEstablishmentServiceID: Number(serviceID),
            scheduledAt: appointmentDateTime,
          },
        });
        toast.success("Agendamento atualizado com sucesso!");
      } else {
        await createAppointmentMutation.mutateAsync({
          workerUUID: workerUUID || "",
          data: {
            customerUUID: user.uuid,
            workerEstablishmentServiceID: Number(serviceID),
            scheduledAt: appointmentDateTime,
          },
        });
        toast.success("Agendamento confirmado com sucesso!");
      }

      navigate(ROUTES.DASHBOARD_APPOINTMENTS);
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as { message?: string }).message === "string" &&
        (error as { message: string }).message.includes("409")
      ) {
        toast.error("Horário indisponível. Escolha outro horário.");
      } else {
        toast.error("Não foi possível confirmar o agendamento.");
      }
    }
  };

  const handleRegisterAndConfirm = async (data: RegisterFormData) => {
    try {
      const formattedPhone = formatToE164(data.phone);
      setRegistrationPhone(formattedPhone);
      setRegistrationName(data.name);

      await register(data.name, formattedPhone, 1);

      setShowRegisterForm(false);
      setShowOtpForm(true);
      toast.info("Código de verificação enviado!");
    } catch {
      toast.error("Erro ao enviar código. Tente novamente.");
    }
  };

  const handleVerifyOtpAndConfirm = async (data: { code: string }) => {
    try {
      const registrationData = {
        name: registrationName,
        typeID: 1,
      };

      await verifyOtpAndCreateProfile(
        registrationPhone,
        data.code,
        registrationData
      );

      toast.success("Conta criada com sucesso!");
      setShowOtpForm(false);

      await handleConfirmAppointment();
    } catch {
      toast.error("Código inválido. Tente novamente.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Título do step */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold">Tudo pronto!</h1>
        <p className="text-lg text-foreground-subtle">
          Confirme os detalhes do seu agendamento
        </p>
      </div>

      {/* Resumo do agendamento */}
      <div className="max-w-lg mx-auto space-y-4">
        <Card className="border-2 border-brand-primary/20">
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-xl bg-brand-primary/5">
                <p className="text-sm text-foreground-subtle mb-1">Data</p>
                <p className="font-bold text-lg">
                  {format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-brand-primary/5">
                <p className="text-sm text-foreground-subtle mb-1">Horário</p>
                <p className="font-bold text-2xl text-brand-primary">{time}</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-foreground-subtle mb-1">Serviço</p>
              <p className="font-semibold text-xl">
                {selectedService.serviceName}
              </p>
            </div>

            <div>
              <p className="text-sm text-foreground-subtle mb-1">
                Profissional
              </p>
              <p className="font-semibold text-lg">{worker.name}</p>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-foreground-subtle mb-1">Valor</p>
              <p className="font-bold text-3xl text-brand-primary">
                R${" "}
                {formatMoney(
                  selectedService.customPrice ?? selectedService.basePrice
                )}
              </p>
              <p className="text-xs text-foreground-subtle mt-1">
                Pagamento direto ao profissional
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Formulários de autenticação */}
        {!isAuthenticated && showRegisterForm && !showOtpForm && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <UserIcon className="w-5 h-5 text-brand-primary" />
                <h2 className="text-lg font-semibold">Seus dados</h2>
              </div>

              <form
                onSubmit={handleSubmit(handleRegisterAndConfirm)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nome completo
                  </label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState }) => (
                      <>
                        <Input
                          {...field}
                          id="name"
                          placeholder="João Silva"
                          error={fieldState.invalid}
                        />
                        <ErrorMessage>{fieldState.error?.message}</ErrorMessage>
                      </>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Celular
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

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={Object.keys(errors).length > 0}
                >
                  Continuar
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {!isAuthenticated && showOtpForm && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-brand-primary" />
                <h2 className="text-lg font-semibold">Código de verificação</h2>
              </div>

              <form
                onSubmit={handleOtpSubmit(handleVerifyOtpAndConfirm)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label htmlFor="code" className="text-sm font-medium">
                    Digite o código enviado para {registrationPhone}
                  </label>
                  <Controller
                    name="code"
                    control={otpControl}
                    render={({ field, fieldState }) => (
                      <>
                        <Input
                          {...field}
                          id="code"
                          placeholder="000000"
                          maxLength={6}
                          className="text-center text-3xl tracking-widest font-mono"
                          error={fieldState.invalid}
                        />
                        <ErrorMessage>{fieldState.error?.message}</ErrorMessage>
                      </>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={Object.keys(otpErrors).length > 0}
                >
                  Verificar e confirmar
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {isAuthenticated && (
          <Button
            size="lg"
            className="w-full text-lg py-6"
            onClick={handleConfirmAppointment}
            disabled={
              createAppointmentMutation.isPending ||
              updateAppointmentMutation.isPending
            }
          >
            {createAppointmentMutation.isPending ||
            updateAppointmentMutation.isPending
              ? "Confirmando..."
              : appointmentUUID
              ? "Atualizar agendamento"
              : "Confirmar agendamento"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ConfirmationStep;
