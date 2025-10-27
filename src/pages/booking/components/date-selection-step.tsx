import { Calendar } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import { format, addDays, startOfToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/utils/cn";
import type { PublicWorkerWithDetails } from "@/types";

interface DateSelectionStepProps {
  worker: PublicWorkerWithDetails;
  serviceID: string;
  appointmentUUID: string | null;
}

const DateSelectionStep = ({
  worker,
  serviceID,
  appointmentUUID,
}: DateSelectionStepProps) => {
  const { workerUUID } = useParams<{ workerUUID: string }>();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const selectedService = worker.services?.find(
    (service) => service.id === Number(serviceID)
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
    if (appointmentUUID) params.append("appointmentUUID", appointmentUUID);

    // Pequeno delay para mostrar o feedback visual
    setTimeout(() => {
      navigate(`/agendar/${workerUUID}?${params.toString()}`, {
        replace: true,
      });
    }, 300);
  };

  return (
    <div className="space-y-8">
      {/* Título do step */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary/10 mb-4">
          <Calendar className="w-8 h-8 text-brand-primary" />
        </div>
        <h1 className="text-4xl font-bold">Quando você prefere?</h1>
        <p className="text-lg text-foreground-subtle">
          Escolha a melhor data para o seu atendimento
        </p>
      </div>

      {/* Serviço selecionado */}
      {selectedService && (
        <div className="max-w-lg mx-auto p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/20">
          <p className="text-sm text-foreground-subtle text-center">
            Serviço selecionado
          </p>
          <p className="text-lg font-semibold text-center mt-1">
            {selectedService.serviceName}
          </p>
        </div>
      )}

      {/* Grid de datas */}
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

export default DateSelectionStep;
