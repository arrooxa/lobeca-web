import { Button } from "@/components";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateEstablishmentService } from "@/services/services/queries";
import { useGetAllCategories } from "@/services/services/queries";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/ui/currency-input";
import { PlusCircle } from "lucide-react";
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

interface ServiceCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ServiceCreateModal = ({ open, onOpenChange }: ServiceCreateModalProps) => {
  const createServiceMutation = useCreateEstablishmentService();
  const { data: categories = [], isLoading: loadingCategories } =
    useGetAllCategories();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EstablishmentServiceFormData>({
    resolver: zodResolver(establishmentServiceSchema),
    defaultValues: {
      categoryID: undefined,
      name: "",
      basePrice: 0,
      duration: 30,
      description: "",
    },
  });

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (data: EstablishmentServiceFormData) => {
    try {
      await createServiceMutation.mutateAsync(data);
      toast.success("Serviço criado com sucesso!");
      handleClose();
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error(
        "Não foi possível criar o serviço. Tente novamente mais tarde."
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Adicionar Serviço
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do novo serviço da barbearia
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Category Field */}
          <div className="space-y-2">
            <Label htmlFor="category">
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
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
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

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nome do Serviço<span className="text-brand-secondary ml-1">*</span>
            </Label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  id="name"
                  placeholder="Corte masculino clássico"
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

          {/* Duration Field */}
          <div className="space-y-2">
            <Label htmlFor="duration">
              Duração (minutos)<span className="text-brand-secondary ml-1">*</span>
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
                    <SelectValue placeholder="Selecione a duração" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="60">60 minutos</SelectItem>
                    <SelectItem value="90">90 minutos</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.duration && (
              <p className="text-sm text-brand-secondary">
                {errors.duration.message}
              </p>
            )}
          </div>

          {/* Base Price Field */}
          <div className="space-y-2">
            <Label htmlFor="basePrice">
              Preço Base<span className="text-brand-secondary ml-1">*</span>
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

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (Opcional)</Label>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <textarea
                  id="description"
                  placeholder="Descreva os detalhes do serviço..."
                  rows={3}
                  className="flex w-full rounded-md border border-color-border bg-white px-3 py-2 text-base shadow-sm placeholder:text-foreground-subtle focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/20 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  {...field}
                />
              )}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={createServiceMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 gap-2"
              disabled={createServiceMutation.isPending}
            >
              {createServiceMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Criando...
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  Criar Serviço
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceCreateModal;
