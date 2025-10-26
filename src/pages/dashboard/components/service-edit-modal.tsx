import { Button } from "@/components";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useUpdateEstablishmentService,
  useDeleteService,
  useGetServiceByID,
} from "@/services/services/queries";
import { useGetAllCategories } from "@/services/services/queries";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { EstablishmentServiceFormData } from "@/types";
import { establishmentServiceSchema } from "@/types/service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ServiceEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceID: number;
}

const ServiceEditModal = ({
  open,
  onOpenChange,
  serviceID,
}: ServiceEditModalProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: service, isLoading: loadingService } = useGetServiceByID(
    { serviceID },
    Boolean(serviceID && open)
  );
  const { data: categories = [], isLoading: loadingCategories } =
    useGetAllCategories();
  const updateServiceMutation = useUpdateEstablishmentService();
  const deleteServiceMutation = useDeleteService();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EstablishmentServiceFormData>({
    resolver: zodResolver(establishmentServiceSchema),
  });

  useEffect(() => {
    if (service && open) {
      reset({
        categoryID: service.categoryID,
        name: service.name,
        basePrice: service.basePrice,
        duration: service.duration,
        description: service.description,
      });
    }
  }, [service, open, reset]);

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const handleDelete = async () => {
    try {
      await deleteServiceMutation.mutateAsync({ serviceID });
      toast.success("Serviço deletado com sucesso!");
      setShowDeleteDialog(false);
      handleClose();
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error(
        "Não foi possível deletar o serviço. Tente novamente mais tarde."
      );
    }
  };

  const onSubmit = async (data: EstablishmentServiceFormData) => {
    try {
      await updateServiceMutation.mutateAsync({
        serviceID,
        data,
      });
      toast.success("Serviço atualizado com sucesso!");
      handleClose();
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error(
        "Não foi possível atualizar o serviço. Tente novamente mais tarde."
      );
    }
  };

  if (loadingService) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Editar Serviço
            </DialogTitle>
            <DialogDescription>Atualize os dados do serviço</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label>
                Categoria<span className="text-brand-secondary ml-1">*</span>
              </Label>
              <Controller
                control={control}
                name="categoryID"
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                    disabled={loadingCategories}
                  >
                    <SelectTrigger
                      className={errors.categoryID ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryID && (
                <p className="text-sm text-brand-secondary">
                  {errors.categoryID.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                Nome<span className="text-brand-secondary ml-1">*</span>
              </Label>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input
                    placeholder="Nome do serviço"
                    error={!!errors.name}
                    {...field}
                  />
                )}
              />
              {errors.name && (
                <p className="text-sm text-brand-secondary">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                Duração (min)
                <span className="text-brand-secondary ml-1">*</span>
              </Label>
              <Controller
                control={control}
                name="duration"
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger
                      className={errors.duration ? "border-red-500" : ""}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">60 minutos</SelectItem>
                      <SelectItem value="90">90 minutos</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>
                Preço<span className="text-brand-secondary ml-1">*</span>
              </Label>
              <Controller
                control={control}
                name="basePrice"
                render={({ field }) => (
                  <CurrencyInput
                    value={field.value / 100} // Converte de centavos para reais
                    onValueChange={field.onChange}
                    error={!!errors.basePrice}
                    placeholder="R$ 0,00"
                  />
                )}
              />
              {errors.basePrice && (
                <p className="text-sm text-brand-secondary">
                  {errors.basePrice.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Descrição</Label>
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <textarea
                    rows={3}
                    className="flex w-full rounded-md border border-color-border bg-white px-3 py-2 text-sm shadow-sm focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/20 focus-visible:outline-none"
                    {...field}
                  />
                )}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 gap-2"
                disabled={updateServiceMutation.isPending}
              >
                {updateServiceMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>

            <Button
              type="button"
              variant="destructive"
              className="w-full gap-2"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="w-4 h-4" />
              Deletar Serviço
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O serviço será permanentemente
              deletado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteServiceMutation.isPending ? "Deletando..." : "Deletar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ServiceEditModal;
