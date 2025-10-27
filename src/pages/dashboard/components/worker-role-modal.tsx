import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import AvatarIcon from "@/components/AvatarIcon";
import { useUpdateUserRole } from "@/services/users/queries";
import { toast } from "react-toastify";
import { UserCog } from "lucide-react";
import type { PublicWorker } from "@/types";

const workerRoleSchema = z.object({
  role: z.enum(["owner", "manager", "worker"]),
});

type WorkerRoleFormData = z.infer<typeof workerRoleSchema>;

interface WorkerRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  worker: PublicWorker | null;
}

const WorkerRoleModal = ({
  open,
  onOpenChange,
  worker,
}: WorkerRoleModalProps) => {
  const [selectedRole, setSelectedRole] = useState<string>(
    worker?.role || "worker"
  );

  const updateUserRoleMutation = useUpdateUserRole();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<WorkerRoleFormData>({
    resolver: zodResolver(workerRoleSchema),
    defaultValues: {
      role: (worker?.role as "owner" | "manager" | "worker") || "worker",
    },
  });

  useEffect(() => {
    if (worker?.role) {
      setSelectedRole(worker.role);
    }
  }, [worker]);

  useEffect(() => {
    if (open && worker?.role) {
      setSelectedRole(worker.role);
    }
  }, [open, worker]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const onSubmit = async () => {
    if (!worker) return;

    if (selectedRole === worker.role) {
      handleClose();
      return;
    }

    try {
      await updateUserRoleMutation.mutateAsync({
        workerUUID: worker.uuid,
        role: selectedRole,
      });

      toast.success("Cargo atualizado com sucesso!");
      handleClose();
    } catch (error) {
      console.error("Error updating worker role:", error);
      toast.error("Não foi possível atualizar o cargo. Tente novamente.");
    }
  };

  if (!worker) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="w-5 h-5" />
            Gerenciar Cargo
          </DialogTitle>
          <DialogDescription>
            Altere o cargo do profissional na barbearia
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-fill-color rounded-lg">
            <AvatarIcon
              name={worker.name}
              photoURL={worker.photoURL}
              size="medium"
            />
            <div>
              <h4 className="font-semibold">
                {worker.nickname || worker.name}
              </h4>
              <p className="text-sm text-foreground-subtle">{worker.name}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">
              Cargo <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Selecione o cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Proprietário</SelectItem>
                <SelectItem value="manager">Gerente</SelectItem>
                <SelectItem value="worker">Funcionário</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-foreground-subtle">
              Proprietários e gerentes têm acesso total ao gerenciamento da
              barbearia
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
              disabled={isSubmitting || selectedRole === worker.role}
              className="flex-1"
            >
              {isSubmitting ? "Salvando..." : "Confirmar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WorkerRoleModal;
