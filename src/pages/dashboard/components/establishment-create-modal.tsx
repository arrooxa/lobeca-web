import { Button } from "@/components";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@/context/UserContext";
import { useCreateEstablishment } from "@/services/establishments/queries";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Building2 } from "lucide-react";
import { useState } from "react";
import type { EstablishmentFormData } from "@/types";
import { establishmentSchema } from "@/types/establishment";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import { APIProvider } from "@vis.gl/react-google-maps";

interface EstablishmentCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EstablishmentCreateModal = ({
  open,
  onOpenChange,
}: EstablishmentCreateModalProps) => {
  const { updateUser } = useUser();
  const createEstablishmentMutation = useCreateEstablishment();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<EstablishmentFormData>({
    resolver: zodResolver(establishmentSchema),
    defaultValues: {
      name: "",
      address: "",
      location: {
        latitude: -23.5505,
        longitude: -46.6333,
      },
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Por favor, selecione uma imagem válida");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5MB");
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setValue("image", undefined);
  };

  const createFormData = (data: EstablishmentFormData): FormData => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("address", data.address);
    formData.append("latitude", data.location.latitude.toString());
    formData.append("longitude", data.location.longitude.toString());

    if (selectedImage) {
      formData.append("photo", selectedImage);
    }

    return formData;
  };

  const handleClose = () => {
    reset();
    setSelectedImage(null);
    setImagePreview(null);
    onOpenChange(false);
  };

  const onSubmit = async (data: EstablishmentFormData) => {
    try {
      const formData = createFormData(data);

      const establishment = await createEstablishmentMutation.mutateAsync(
        formData
      );

      await updateUser({ establishmentID: establishment.id });

      toast.success("Barbearia criada com sucesso!");

      handleClose();
    } catch (error) {
      console.error("Error creating establishment:", error);
      toast.error(
        "Não foi possível criar a barbearia. Tente novamente mais tarde."
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Nova Barbearia
          </DialogTitle>
          <DialogDescription>
            Preencha os dados para criar sua barbearia
          </DialogDescription>
        </DialogHeader>

        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nome da Barbearia
                <span className="text-brand-secondary ml-1">*</span>
              </Label>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input
                    id="name"
                    placeholder="Digite o nome da barbearia"
                    error={Boolean(errors.name)}
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
              <Controller
                control={control}
                name="address"
                render={({ field }) => (
                  <LocationAutocomplete
                    value={field.value}
                    onChange={field.onChange}
                    onPlaceSelect={(place) => {
                      setValue("address", place.address);
                      setValue("location.latitude", place.latitude);
                      setValue("location.longitude", place.longitude);
                    }}
                    error={Boolean(errors.address)}
                    errorMessage={errors.address?.message}
                    label="Endereço"
                    placeholder="Digite o endereço da barbearia"
                    required
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Logo/Foto da Barbearia (Opcional)</Label>

              {!imagePreview ? (
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-brand-primary/50 hover:bg-fill-color transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-4 pb-5">
                    <Upload className="w-10 h-10 text-gray-400 mb-2" />
                    <p className="mb-1 text-sm text-gray-500">
                      <span className="font-semibold">Clique para upload</span>
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              ) : (
                <div className="relative w-full h-40 border-2 border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
                disabled={createEstablishmentMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 gap-2"
                disabled={createEstablishmentMutation.isPending}
              >
                {createEstablishmentMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Building2 className="w-4 h-4" />
                    Criar Barbearia
                  </>
                )}
              </Button>
            </div>
          </form>
        </APIProvider>
      </DialogContent>
    </Dialog>
  );
};

export default EstablishmentCreateModal;
