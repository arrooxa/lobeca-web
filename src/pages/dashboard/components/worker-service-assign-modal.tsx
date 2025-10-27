import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CurrencyInput } from "@/components";
import AvatarIcon from "@/components/AvatarIcon";
import { useCreateWorkerEstablishmentService } from "@/services/services/queries";
import { toast } from "react-toastify";
import { UserPlus } from "lucide-react";
import type { PublicWorker } from "@/types";
import {
  workerEstablishmentServiceSchema,
  type WorkerEstablishmentServiceFormData,
} from "@/types/service";

interface WorkerServiceAssignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceID: number;
  availableWorkers: PublicWorker[];
}

const WorkerServiceAssignModal = ({
  open,
  onOpenChange,
  serviceID,
  availableWorkers,
}: WorkerServiceAssignModalProps) => {
  const [selectedWorkerUUID, setSelectedWorkerUUID] = useState<string>("");

  const createWorkerServiceMutation = useCreateWorkerEstablishmentService();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WorkerEstablishmentServiceFormData>({
    resolver: zodResolver(workerEstablishmentServiceSchema),
    defaultValues: {
      workerUUID: "",
      customPrice: undefined,
    },
  });

  const handleClose = () => {
    reset();
    setSelectedWorkerUUID("");
    onOpenChange(false);
  };

  // Reset form when modal opens with new data
  useEffect(() => {
    if (open) {
      reset({
        workerUUID: "",
        customPrice: undefined,
      });
      setSelectedWorkerUUID("");
    }
  }, [open, reset]);

  const onSubmit = async (data: WorkerEstablishmentServiceFormData) => {
    try {
      await createWorkerServiceMutation.mutateAsync({
        establishmentServiceID: serviceID,
        workerUUID: data.workerUUID,
        customPrice: data.customPrice,
      });

      toast.success("Serviço atribuído ao profissional com sucesso!");
      handleClose();
    } catch (error) {
      console.error("Error assigning service to worker:", error);
      toast.error(
        "Não foi possível atribuir o serviço. Tente novamente mais tarde."
      );
    }
  };

  const selectedWorker = availableWorkers.find(
    (w) => w.uuid === selectedWorkerUUID
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Atribuir Serviço ao Profissional
          </DialogTitle>
          <DialogDescription>
            Selecione um profissional para executar este serviço
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="worker">
              Profissional <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="workerUUID"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedWorkerUUID(value);
                  }}
                >
                  <SelectTrigger
                    id="worker"
                    className={errors.workerUUID ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Selecione um profissional" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableWorkers.length === 0 ? (
                      <div className="p-4 text-center text-sm text-foreground-subtle">
                        Nenhum profissional disponível
                      </div>
                    ) : (
                      availableWorkers.map((worker) => (
                        <SelectItem key={worker.uuid} value={worker.uuid}>
                          <div className="flex items-center gap-2">
                            <span>{worker.nickname || worker.name}</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.workerUUID && (
              <p className="text-xs text-red-500">
                {errors.workerUUID.message}
              </p>
            )}
          </div>

          {selectedWorker && (
            <div className="flex items-center gap-4 p-4 bg-brand-tertiary/20 rounded-lg border border-brand-primary/20">
              <AvatarIcon
                name={selectedWorker.name}
                photoURL={selectedWorker.photoURL}
                size="small"
              />
              <div>
                <p className="font-semibold">
                  {selectedWorker.nickname || selectedWorker.name}
                </p>
                <p className="text-xs text-foreground-subtle">
                  {selectedWorker.name}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="customPrice">Preço Personalizado (opcional)</Label>
            <Controller
              control={control}
              name="customPrice"
              render={({ field }) => (
                <CurrencyInput
                  id="customPrice"
                  value={(field.value || 0) / 100}
                  onValueChange={field.onChange}
                  error={Boolean(errors.customPrice)}
                  placeholder="R$ 0,00"
                />
              )}
            />
            {errors.customPrice && (
              <p className="text-xs text-red-500">
                {errors.customPrice.message}
              </p>
            )}
            <p className="text-xs text-foreground-subtle">
              Se não informado, será usado o preço base do serviço
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || availableWorkers.length === 0}
              className="flex-1"
            >
              {isSubmitting ? "Atribuindo..." : "Atribuir"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WorkerServiceAssignModal;
