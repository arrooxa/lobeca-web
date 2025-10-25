import { useState } from "react";
import { ChevronDown, Clock, Calendar } from "lucide-react";

import { Card, CardContent } from "@/components/ui";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui";
import DayScheduleForm from "./components/day-schedule-form";
import { daysOfWeek } from "@/utils";
import { cn } from "@/utils/cn";
import { useGetAllCurrentUserSchedules } from "@/services/users/queries";
import DashboardLayout from "@/layouts/dashboard";

const Schedule = () => {
  const [openDays, setOpenDays] = useState<number[]>([]);

  const {
    data: schedulesMap,
    isLoading,
    error,
  } = useGetAllCurrentUserSchedules(true);

  const toggleDay = (dayIndex: number) => {
    setOpenDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((d) => d !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-brand-primary/10 rounded-full blur-xl animate-pulse" />
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-primary/20 border-t-brand-primary"></div>
            </div>
          </div>
          <p className="text-foreground-subtle">Carregando seus horários...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-red-500/10 rounded-full blur-xl animate-pulse" />
            <div className="relative bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full p-6">
              <Calendar className="w-16 h-16 text-red-500" strokeWidth={1.5} />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Erro ao carregar horários
          </h3>
          <p className="text-center text-foreground-subtle max-w-sm">
            Não conseguimos carregar seus horários. Tente novamente mais tarde.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const activeSchedulesCount =
    Object.values(schedulesMap || {}).filter((s) => s.isActive).length || 0;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-primary/20 rounded-full blur-md" />
              <div className="relative bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-full p-3">
                <Clock className="w-8 h-8 text-brand-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Horários de Atendimento
              </h1>
              <p className="text-foreground-subtle">
                {activeSchedulesCount > 0
                  ? `${activeSchedulesCount} ${
                      activeSchedulesCount === 1
                        ? "dia configurado"
                        : "dias configurados"
                    }`
                  : "Configure seus horários de trabalho"}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 border border-brand-primary/10 rounded-lg p-4 mt-4">
            <p className="text-sm text-gray-700">
              💡 <span className="font-semibold">Dica:</span> Configure seus
              horários de atendimento para cada dia da semana. Você pode definir
              horários de início e fim, além de adicionar intervalos durante o
              dia.
            </p>
          </div>
        </div>

        {/* Days List */}
        <div className="space-y-3">
          {daysOfWeek.map((day, index) => {
            const schedule = schedulesMap?.[index];
            const hasSchedule = schedule && schedule.isActive;

            return (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-md transition-all duration-200"
              >
                <Collapsible
                  open={openDays.includes(index)}
                  onOpenChange={() => toggleDay(index)}
                >
                  <CollapsibleTrigger className="w-full">
                    <CardContent className="flex items-center justify-between p-5 cursor-pointer hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-200 group">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="relative">
                          <div
                            className={cn(
                              "absolute inset-0 rounded-full blur-md transition-all duration-200",
                              hasSchedule
                                ? "bg-brand-primary/20 group-hover:bg-brand-primary/30"
                                : "bg-gray-200/50"
                            )}
                          />
                          <div
                            className={cn(
                              "relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200",
                              hasSchedule
                                ? "bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 group-hover:scale-110"
                                : "bg-gray-100 group-hover:bg-gray-200"
                            )}
                          >
                            <span
                              className={cn(
                                "text-lg font-bold transition-colors duration-200",
                                hasSchedule
                                  ? "text-brand-primary group-hover:text-brand-primary"
                                  : "text-gray-400 group-hover:text-gray-500"
                              )}
                            >
                              {day.charAt(0)}
                            </span>
                          </div>
                        </div>

                        <div className="text-left flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-primary transition-colors">
                            {day}
                          </h3>
                          {hasSchedule && (
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3.5 h-3.5 text-brand-primary" />
                              <p className="text-sm text-foreground-subtle">
                                {schedule.startTime} - {schedule.endTime}
                              </p>
                              {schedule.breaks &&
                                schedule.breaks.length > 0 && (
                                  <span className="ml-2 px-2 py-0.5 bg-brand-primary/10 text-brand-primary text-xs font-medium rounded-full">
                                    {schedule.breaks.length}{" "}
                                    {schedule.breaks.length === 1
                                      ? "intervalo"
                                      : "intervalos"}
                                  </span>
                                )}
                            </div>
                          )}
                          {!hasSchedule && (
                            <p className="text-sm text-gray-400 mt-1">
                              Sem horário configurado
                            </p>
                          )}
                        </div>
                      </div>

                      <ChevronDown
                        className={cn(
                          "w-5 h-5 text-gray-400 transition-all duration-200 group-hover:text-brand-primary",
                          openDays.includes(index) && "transform rotate-180"
                        )}
                      />
                    </CardContent>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="pt-0 pb-5 px-5">
                      <div className="border-t border-gray-100 pt-5">
                        <DayScheduleForm
                          dayOfWeek={index}
                          initialData={schedule}
                          onSuccess={() => {
                            toggleDay(index);
                          }}
                        />
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </div>

        {/* Footer Info */}
        {activeSchedulesCount === 0 && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-foreground-subtle bg-gray-50 px-4 py-2 rounded-full">
              <Calendar className="w-4 h-4" />
              <span>Clique em um dia para começar a configurar</span>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Schedule;
