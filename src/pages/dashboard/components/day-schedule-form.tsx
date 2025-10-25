import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X } from "lucide-react";
import { toast } from "react-toastify";

import { Button, Checkbox } from "@/components/ui";
import TimeSelector from "@/components/TimeSelector";
import {
  type InsertWorkerScheduleRequest,
  type UserWeeklyScheduleAndBreaks,
} from "@/types";
import { hoursOfDay } from "@/utils";
import { useInsertCurrentUserSchedule } from "@/services/users/queries";

const scheduleSchema = z
  .object({
    startTime: z.string().min(1, "Horário de início é obrigatório"),
    endTime: z.string().min(1, "Horário de fim é obrigatório"),
    isActive: z.boolean(),
    breaks: z.array(
      z.object({
        startTime: z
          .string()
          .min(1, "Horário de início do intervalo é obrigatório"),
        endTime: z.string().min(1, "Horário de fim do intervalo é obrigatório"),
      })
    ),
  })
  .refine(
    (data) => {
      if (data.isActive && data.startTime >= data.endTime) {
        return false;
      }
      return true;
    },
    {
      message: "Horário de início deve ser anterior ao horário de fim",
      path: ["startTime"],
    }
  )
  .refine(
    (data) => {
      if (data.isActive && data.breaks) {
        for (const breakTime of data.breaks) {
          if (breakTime.startTime >= breakTime.endTime) {
            return false;
          }
        }
      }
      return true;
    },
    {
      message:
        "Horário de início do intervalo deve ser anterior ao horário de fim",
      path: ["breaks"],
    }
  );

interface DayScheduleFormProps {
  dayOfWeek: number;
  initialData?: UserWeeklyScheduleAndBreaks;
  onSuccess?: () => void;
}

const DayScheduleForm = ({
  dayOfWeek,
  initialData,
  onSuccess,
}: DayScheduleFormProps) => {
  const insertWorkerScheduleMutation = useInsertCurrentUserSchedule();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InsertWorkerScheduleRequest>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      startTime: hoursOfDay[0],
      endTime: hoursOfDay[1],
      isActive: false,
      breaks: [],
    },
  });

  const watchedBreaks = watch("breaks") || [];
  const isActive = watch("isActive");

  const addBreak = () => {
    setValue("breaks", [
      ...watchedBreaks,
      {
        startTime: hoursOfDay[0],
        endTime: hoursOfDay[1],
      },
    ]);
  };

  const removeBreak = (index: number) => {
    setValue(
      "breaks",
      watchedBreaks.filter((_, breakIndex) => breakIndex !== index)
    );
  };

  const onSubmit = async (data: InsertWorkerScheduleRequest) => {
    try {
      await insertWorkerScheduleMutation.mutateAsync({
        weekDay: dayOfWeek,
        data: {
          startTime: data.startTime,
          endTime: data.endTime,
          isActive: data.isActive,
          breaks: data.breaks,
        },
      });

      toast.success("Horário de atendimento salvo com sucesso!");
      onSuccess?.();
    } catch {
      toast.error("Erro ao salvar horário. Tente novamente mais tarde.");
    }
  };

  useEffect(() => {
    if (initialData) {
      setValue("startTime", initialData.startTime);
      setValue("endTime", initialData.endTime);
      setValue("isActive", initialData.isActive);
      setValue("breaks", initialData.breaks || []);
    }
  }, [initialData, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-3">
        <Controller
          control={control}
          name="isActive"
          render={({ field: { onChange, value } }) => (
            <Checkbox checked={value} onCheckedChange={onChange} />
          )}
        />
        <label className="text-lg font-semibold cursor-pointer">
          Atendimento ativo
        </label>
      </div>

      {isActive && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">Início de atendimento</label>
            <Controller
              control={control}
              name="startTime"
              render={({ field: { onChange, value } }) => (
                <TimeSelector
                  value={value}
                  onValueChange={onChange}
                  placeholder="Selecione o horário de início"
                />
              )}
            />
            {(errors.startTime || errors.endTime) && (
              <p className="text-sm text-red-500">
                {errors.startTime?.message || errors.endTime?.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Final de atendimento</label>
            <Controller
              control={control}
              name="endTime"
              render={({ field: { onChange, value } }) => (
                <TimeSelector
                  value={value}
                  onValueChange={onChange}
                  placeholder="Selecione o horário de término"
                />
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Intervalos</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addBreak}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar intervalo
              </Button>
            </div>

            {watchedBreaks.length > 0 && (
              <div className="space-y-3">
                {watchedBreaks.map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <Controller
                        control={control}
                        name={`breaks.${index}.startTime`}
                        render={({ field: { onChange, value } }) => (
                          <TimeSelector
                            value={value}
                            onValueChange={onChange}
                            placeholder="Início"
                          />
                        )}
                      />
                    </div>
                    <span className="text-sm font-medium">até</span>
                    <div className="flex-1">
                      <Controller
                        control={control}
                        name={`breaks.${index}.endTime`}
                        render={({ field: { onChange, value } }) => (
                          <TimeSelector
                            value={value}
                            onValueChange={onChange}
                            placeholder="Fim"
                          />
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBreak(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {errors.breaks && (
              <p className="text-sm text-red-500">
                {errors.breaks.message ||
                  "Horário de início do intervalo deve ser anterior ao horário de fim."}
              </p>
            )}
          </div>
        </>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={insertWorkerScheduleMutation.isPending}
      >
        {insertWorkerScheduleMutation.isPending ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
};

export default DayScheduleForm;
