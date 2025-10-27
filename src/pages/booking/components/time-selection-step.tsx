import { Clock, AlertCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import { format, parse, isAfter, set } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/utils/cn";
import type { PublicWorkerWithDetails } from "@/types";
import { useGetUserAvailability } from "@/services/users/queries";
import { Card, CardContent } from "@/components/ui/card";

interface TimeSelectionStepProps {
  worker: PublicWorkerWithDetails;
  serviceID: string;
  date: string;
  appointmentUUID: string | null;
}

const TimeSelectionStep = ({
  worker,
  serviceID,
  date,
  appointmentUUID,
}: TimeSelectionStepProps) => {
  const { workerUUID } = useParams<{ workerUUID: string }>();
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
    workerUUID || "",
    dayOfWeek,
    date || "",
    Boolean(workerUUID && date)
  );

  const selectedService = worker.services?.find(
    (service) => service.id === Number(serviceID)
  );

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);

    const params = new URLSearchParams();
    params.append("serviceID", serviceID);
    params.append("date", date);
    params.append("time", time);
    if (appointmentUUID) params.append("appointmentUUID", appointmentUUID);

    setTimeout(() => {
      navigate(`/agendar/${workerUUID}?${params.toString()}`, {
        replace: true,
      });
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
            <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
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
        <h1 className="text-4xl font-bold">Que horas funciona pra você?</h1>
        <p className="text-lg text-foreground-subtle">
          Selecione o melhor horário disponível
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
              <AlertCircle className="w-8 h-8 text-red-500" />
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

export default TimeSelectionStep;
