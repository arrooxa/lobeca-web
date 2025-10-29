import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import DashboardLayout from "@/layouts/dashboard";
import { useUser } from "@/context/UserContext";
import { useGetWorkerInfo } from "@/services/users/queries";
import { Button, Card, CardContent } from "@/components";
import {
  ChevronLeft,
  Clock,
  Calendar as CalendarIcon,
  Scissors,
} from "lucide-react";
import { ROUTES } from "@/constants";
import type { WorkerEstablishmentServiceWithDetails } from "@/types";
import { format, parse, isAfter, set, addDays, startOfToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/utils/cn";
import { useGetUserAvailability } from "@/services/users/queries";
import { useCreateAppointmentByWorker } from "@/services/appointments/queries";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";

interface WorkerWithServices {
  uuid: string;
  name: string;
  services: WorkerEstablishmentServiceWithDetails[];
}

const CreateCustomAppointmentPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const serviceID = searchParams.get("serviceID");
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  const [customerIdentification, setCustomerIdentification] = useState("");

  const {
    data: worker,
    isLoading: isLoadingWorker,
    error: workerError,
  } = useGetWorkerInfo(user?.uuid || "", Boolean(user?.uuid));

  const getCurrentStep = () => {
    if (!serviceID) return "service";
    if (!date) return "date";
    if (!time) return "time";
    return "confirm";
  };

  const currentStep = getCurrentStep();

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <h1 className="font-bold text-2xl text-center">
            Faça login para criar agendamentos!
          </h1>
          <Button size="lg" onClick={() => navigate(ROUTES.LOGIN)}>
            Login
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoadingWorker) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-lg">Carregando...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (workerError || !worker) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-lg text-red-500">
              Erro ao carregar suas informações
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case "service":
        return (
          <ServiceSelectionStep
            worker={worker}
            customerIdentification={customerIdentification}
            setCustomerIdentification={setCustomerIdentification}
          />
        );
      case "date":
        return (
          <DateSelectionStep
            worker={worker}
            serviceID={serviceID!}
            customerIdentification={customerIdentification}
          />
        );
      case "time":
        return (
          <TimeSelectionStep
            worker={worker}
            serviceID={serviceID!}
            date={date!}
            customerIdentification={customerIdentification}
          />
        );
      case "confirm":
        return (
          <ConfirmationStep
            worker={worker}
            serviceID={serviceID!}
            date={date!}
            time={time!}
            customerIdentification={customerIdentification}
          />
        );
      default:
        return (
          <ServiceSelectionStep
            worker={worker}
            customerIdentification={customerIdentification}
            setCustomerIdentification={setCustomerIdentification}
          />
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 mb-4"
            onClick={() => {
              if (currentStep === "confirm") {
                const newParams = new URLSearchParams(searchParams);
                newParams.delete("time");
                navigate(
                  `${
                    ROUTES.DASHBOARD_CREATE_CUSTOM_APPOINTMENT
                  }?${newParams.toString()}`,
                  { replace: true }
                );
              } else if (currentStep === "time") {
                const newParams = new URLSearchParams(searchParams);
                newParams.delete("date");
                navigate(
                  `${
                    ROUTES.DASHBOARD_CREATE_CUSTOM_APPOINTMENT
                  }?${newParams.toString()}`,
                  { replace: true }
                );
              } else if (currentStep === "date") {
                navigate(ROUTES.DASHBOARD_CREATE_CUSTOM_APPOINTMENT, {
                  replace: true,
                });
              } else {
                navigate(ROUTES.DASHBOARD_APPOINTMENTS);
              }
            }}
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Button>

          <div className="flex items-center gap-4 mb-6">
            {["service", "date", "time", "confirm"].map((step, index) => {
              const stepIndex = ["service", "date", "time", "confirm"].indexOf(
                currentStep
              );
              const isActive = index === stepIndex;
              const isCompleted = index < stepIndex;

              return (
                <div
                  key={step}
                  className={`h-2 rounded-full transition-all duration-500 flex-1 ${
                    isActive
                      ? "bg-brand-primary"
                      : isCompleted
                      ? "bg-brand-primary"
                      : "bg-gray-300"
                  }`}
                />
              );
            })}
          </div>
        </div>

        <div
          key={currentStep}
          className="animate-in fade-in slide-in-from-bottom-8 duration-700"
        >
          {renderStep()}
        </div>
      </div>
    </DashboardLayout>
  );
};

// ========== STEP COMPONENTS ==========

interface ServiceSelectionStepProps {
  worker: WorkerWithServices;
  customerIdentification: string;
  setCustomerIdentification: (value: string) => void;
}

const ServiceSelectionStep = ({
  worker,
  customerIdentification,
  setCustomerIdentification,
}: ServiceSelectionStepProps) => {
  const navigate = useNavigate();

  const handleServiceSelect = (
    service: WorkerEstablishmentServiceWithDetails
  ) => {
    const params = new URLSearchParams();
    params.append("serviceID", service.id.toString());

    navigate(
      `${ROUTES.DASHBOARD_CREATE_CUSTOM_APPOINTMENT}?${params.toString()}`,
      {
        replace: true,
      }
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary/10 mb-4">
          <Scissors className="w-8 h-8 text-brand-primary" />
        </div>
        <h1 className="text-4xl font-bold">Criar Agendamento</h1>
        <p className="text-lg text-foreground-subtle">
          Preencha os dados do cliente e selecione o serviço
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="space-y-2 mb-6">
            <label className="text-sm font-medium">
              Identificação do Cliente <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Ex: José - (13) 91234-5678"
              value={customerIdentification}
              onChange={(e) => setCustomerIdentification(e.target.value)}
              required
            />
          </div>

          {customerIdentification && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Atenção:</strong> O pagamento deverá ser realizado
                presencialmente no estabelecimento.
              </p>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-semibold text-lg mb-4">Selecione o Serviço</h3>
            {worker.services && worker.services.length > 0 ? (
              worker.services.map(
                (service: WorkerEstablishmentServiceWithDetails) => (
                  <Card
                    key={service.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-lg hover:border-brand-primary",
                      !customerIdentification &&
                        "opacity-50 cursor-not-allowed pointer-events-none"
                    )}
                    onClick={() =>
                      customerIdentification && handleServiceSelect(service)
                    }
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-lg">
                          {service.serviceName}
                        </h4>
                        {service.serviceDescription && (
                          <p className="text-sm text-foreground-subtle">
                            {service.serviceDescription}
                          </p>
                        )}
                        <p className="text-sm text-foreground-subtle mt-1">
                          Duração: {service.duration} minutos
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-brand-primary">
                          R${" "}
                          {(
                            (service.customPrice ?? service.basePrice) / 100
                          ).toFixed(2)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              )
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-foreground-subtle">
                    Você não possui serviços cadastrados. Adicione seus serviços
                    na página da sua barbearia para criar novos agendamentos.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface DateSelectionStepProps {
  worker: WorkerWithServices;
  serviceID: string;
  customerIdentification: string;
}

const DateSelectionStep = ({
  worker,
  serviceID,
  customerIdentification,
}: DateSelectionStepProps) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const selectedService = worker.services?.find(
    (service: WorkerEstablishmentServiceWithDetails) =>
      service.id === Number(serviceID)
  );

  // Gerar próximos 14 dias
  const today = startOfToday();
  const availableDates = Array.from({ length: 14 }, (_, i) =>
    addDays(today, i)
  );

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);

    const params = new URLSearchParams();
    params.append("serviceID", serviceID);
    params.append("date", format(date, "yyyy-MM-dd"));

    setTimeout(() => {
      navigate(
        `${ROUTES.DASHBOARD_CREATE_CUSTOM_APPOINTMENT}?${params.toString()}`,
        { replace: true }
      );
    }, 300);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary/10 mb-4">
          <CalendarIcon className="w-8 h-8 text-brand-primary" />
        </div>
        <h1 className="text-4xl font-bold">Qual dia funciona melhor?</h1>
        <p className="text-lg text-foreground-subtle">
          Escolha a data do agendamento
        </p>
      </div>

      <div className="max-w-lg mx-auto p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/20">
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-foreground-subtle">Serviço</p>
            <p className="font-semibold">{selectedService?.serviceName}</p>
          </div>
          <div className="text-right">
            <p className="text-foreground-subtle">Cliente</p>
            <p className="font-semibold">{customerIdentification}</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto grid grid-cols-2 gap-3">
        {availableDates.map((date) => {
          const isSelected =
            selectedDate &&
            format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
          const isToday =
            format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");

          return (
            <button
              key={date.toISOString()}
              onClick={() => handleDateSelect(date)}
              className={cn(
                "p-6 rounded-2xl border-2 transition-all duration-300 text-left group hover:scale-[1.02] active:scale-[0.98]",
                isSelected
                  ? "border-brand-primary bg-brand-primary text-white shadow-lg"
                  : "border-gray-200 bg-card hover:border-brand-primary hover:shadow-lg"
              )}
            >
              <div className="space-y-2">
                <p
                  className={cn(
                    "text-3xl font-bold",
                    isSelected ? "text-white" : "text-foreground"
                  )}
                >
                  {format(date, "dd")}
                </p>
                <div>
                  <p
                    className={cn(
                      "text-sm font-medium capitalize",
                      isSelected ? "text-white/90" : "text-foreground-subtle"
                    )}
                  >
                    {format(date, "EEEE", { locale: ptBR })}
                  </p>
                  <p
                    className={cn(
                      "text-xs capitalize",
                      isSelected ? "text-white/75" : "text-foreground-subtle"
                    )}
                  >
                    {format(date, "MMMM", { locale: ptBR })}
                  </p>
                </div>
                {isToday && !isSelected && (
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-brand-primary/10 text-brand-primary rounded-full">
                    Hoje
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

interface TimeSelectionStepProps {
  worker: WorkerWithServices;
  serviceID: string;
  date: string;
  customerIdentification: string;
}

const TimeSelectionStep = ({
  worker,
  serviceID,
  date,
}: TimeSelectionStepProps) => {
  const navigate = useNavigate();
  const [selectedTime, setSelectedTime] = useState<string>("");

  const selectedDate = date
    ? parse(date, "yyyy-MM-dd", new Date())
    : new Date();
  const dayOfWeek = selectedDate.getDay();

  const {
    data: availability,
    isLoading: isLoadingAvailability,
    error: availabilityError,
  } = useGetUserAvailability(
    worker.uuid || "",
    dayOfWeek,
    date || "",
    Boolean(worker.uuid && date)
  );

  const selectedService = worker.services?.find(
    (service: WorkerEstablishmentServiceWithDetails) =>
      service.id === Number(serviceID)
  );

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);

    const params = new URLSearchParams();
    params.append("serviceID", serviceID);
    params.append("date", date);
    params.append("time", time);

    setTimeout(() => {
      navigate(
        `${ROUTES.DASHBOARD_CREATE_CUSTOM_APPOINTMENT}?${params.toString()}`,
        { replace: true }
      );
    }, 300);
  };

  if (isLoadingAvailability) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary/10 mb-4">
            <Clock className="w-8 h-8 text-brand-primary animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold">Carregando horários...</h1>
          <p className="text-lg text-foreground-subtle">
            Buscando os melhores horários disponíveis
          </p>
        </div>
      </div>
    );
  }

  if (availabilityError || !selectedService) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 mx-auto text-red-500" />
            <h3 className="text-xl font-semibold text-red-500">
              Erro ao carregar horários
            </h3>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isWorkerAvailable =
    availability?.workingHours?.isActive &&
    availability.availableSlots &&
    availability.availableSlots.length > 0;

  // Filter out time slots that are in the past
  const filteredSlots =
    availability?.availableSlots?.filter((slot) => {
      const [hours, minutes] = slot.startTime.split(":").map(Number);
      const slotDateTime = set(selectedDate, {
        hours,
        minutes,
        seconds: 0,
        milliseconds: 0,
      });
      return isAfter(slotDateTime, new Date());
    }) || [];

  const hasAvailableSlots = isWorkerAvailable && filteredSlots.length > 0;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary/10 mb-4">
          <Clock className="w-8 h-8 text-brand-primary" />
        </div>
        <h1 className="text-4xl font-bold">Que horas funciona melhor?</h1>
        <p className="text-lg text-foreground-subtle">
          Selecione o horário disponível
        </p>
      </div>

      <div className="max-w-lg mx-auto p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/20">
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-foreground-subtle">Serviço</p>
            <p className="font-semibold">{selectedService.serviceName}</p>
          </div>
          <div className="text-right">
            <p className="text-foreground-subtle">Data</p>
            <p className="font-semibold">
              {format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}
            </p>
          </div>
        </div>
      </div>

      {hasAvailableSlots ? (
        <div className="max-w-lg mx-auto grid grid-cols-3 gap-3">
          {filteredSlots.map((slot) => {
            const isSelected = selectedTime === slot.startTime;

            return (
              <button
                key={slot.startTime}
                onClick={() => handleTimeSelect(slot.startTime)}
                className={cn(
                  "py-6 px-4 rounded-2xl border-2 font-semibold text-xl transition-all duration-300 hover:scale-[1.05] active:scale-[0.95]",
                  isSelected
                    ? "border-brand-primary bg-brand-primary text-white shadow-lg"
                    : "border-gray-200 bg-card hover:border-brand-primary hover:shadow-lg"
                )}
              >
                {slot.startTime}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="max-w-lg mx-auto py-12 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <Clock className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum horário disponível
            </h3>
            <p className="text-foreground-subtle">
              Tente selecionar outra data
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

interface ConfirmationStepProps {
  worker: WorkerWithServices;
  serviceID: string;
  date: string;
  time: string;
  customerIdentification: string;
}

const ConfirmationStep = ({
  worker,
  serviceID,
  date,
  time,
  customerIdentification,
}: ConfirmationStepProps) => {
  const navigate = useNavigate();
  const createAppointmentByWorkerMutation = useCreateAppointmentByWorker();

  const selectedService = worker.services?.find(
    (service: WorkerEstablishmentServiceWithDetails) =>
      service.id === Number(serviceID)
  );

  const selectedDate = parse(date, "yyyy-MM-dd", new Date());
  const [hours, minutes] = time.split(":").map(Number);
  const appointmentDateTime = set(selectedDate, {
    hours,
    minutes,
    seconds: 0,
    milliseconds: 0,
  });

  const handleConfirm = async () => {
    try {
      await createAppointmentByWorkerMutation.mutateAsync({
        workerUUID: worker.uuid,
        data: {
          workerEstablishmentServiceID: Number(serviceID),
          customerIdentification,
          scheduledAt: appointmentDateTime,
        },
      });

      toast.success("Agendamento criado com sucesso!");
      navigate(ROUTES.DASHBOARD_APPOINTMENTS);
    } catch (error) {
      if (error instanceof Error && error.message.includes("409")) {
        toast.error(
          "Horário indisponível. Escolha outro horário para o agendamento."
        );
      } else {
        toast.error(
          "Não foi possível criar o agendamento. Tente novamente mais tarde."
        );
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary/10 mb-4">
          <CalendarIcon className="w-8 h-8 text-brand-primary" />
        </div>
        <h1 className="text-4xl font-bold">Confirmar Agendamento</h1>
        <p className="text-lg text-foreground-subtle">
          Revise os detalhes antes de confirmar
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-sm text-foreground-subtle mb-1">Cliente</h3>
            <p className="text-xl font-semibold">{customerIdentification}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm text-foreground-subtle mb-1">Serviço</h3>
              <p className="text-lg font-semibold">
                {selectedService?.serviceName}
              </p>
            </div>
            <div>
              <h3 className="text-sm text-foreground-subtle mb-1">Valor</h3>
              <p className="text-lg font-semibold text-brand-primary">
                R${" "}
                {selectedService
                  ? (
                      (selectedService.customPrice ??
                        selectedService.basePrice) / 100
                    ).toFixed(2)
                  : "0.00"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm text-foreground-subtle mb-1">Data</h3>
              <p className="text-lg font-semibold">
                {format(appointmentDateTime, "EEEE, d 'de' MMMM", {
                  locale: ptBR,
                })}
              </p>
            </div>
            <div>
              <h3 className="text-sm text-foreground-subtle mb-1">Horário</h3>
              <p className="text-lg font-semibold">
                {format(appointmentDateTime, "HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Lembrete:</strong> O pagamento deverá ser realizado
              presencialmente no estabelecimento.
            </p>
          </div>

          <Button
            onClick={handleConfirm}
            disabled={createAppointmentByWorkerMutation.isPending}
            className="w-full"
            size="lg"
          >
            {createAppointmentByWorkerMutation.isPending
              ? "Criando agendamento..."
              : "Confirmar Agendamento"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCustomAppointmentPage;
