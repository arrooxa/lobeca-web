import { Button } from "@/components";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@/context/UserContext";
import {
  useUpdateEstablishment,
  useDeleteEstablishment,
} from "@/services/establishments/queries";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Building2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import type { EstablishmentFormData, EstablishmentWithDetails } from "@/types";
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

interface EstablishmentEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  establishment: EstablishmentWithDetails;
}

const EstablishmentEditModal = ({
  open,
  onOpenChange,
  establishment,
}: EstablishmentEditModalProps) => {
  const { user, updateUser } = useUser();
  const updateEstablishmentMutation = useUpdateEstablishment();
  const deleteEstablishmentMutation = useDeleteEstablishment();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<EstablishmentFormData>({
    resolver: zodResolver(establishmentSchema),
    defaultValues: {
      name: establishment.name,
      address: establishment.address,
      location: {
        latitude: establishment.latitude,
        longitude: establishment.longitude,
      },
    },
  });

  useEffect(() => {
    if (establishment && open) {
      reset({
        name: establishment.name,
        address: establishment.address,
        location: {
          latitude: establishment.latitude,
          longitude: establishment.longitude,
        },
      });
      setImagePreview(establishment.photoURL || null);
      setSelectedImage(null);
    }
  }, [establishment, open, reset]);

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
    setImagePreview(establishment.photoURL || null);
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
    setImagePreview(establishment.photoURL || null);
    onOpenChange(false);
  };

  const handleDelete = async () => {
    try {
      await deleteEstablishmentMutation.mutateAsync(establishment.uuid);
      await updateUser({ establishmentID: undefined });
      toast.success("Barbearia deletada com sucesso!");
      setShowDeleteDialog(false);
      handleClose();
    } catch (error) {
      console.error("Error deleting establishment:", error);
      toast.error(
        "Não foi possível deletar a barbearia. Tente novamente mais tarde."
      );
    }
  };

  const onSubmit = async (data: EstablishmentFormData) => {
    try {
      const formData = createFormData(data);

      await updateEstablishmentMutation.mutateAsync({
        establishmentUUID: establishment.uuid,
        formData,
      });

      toast.success("Barbearia atualizada com sucesso!");
      handleClose();
    } catch (error) {
      console.error("Error updating establishment:", error);
      toast.error(
        "Não foi possível atualizar a barbearia. Tente novamente mais tarde."
      );
    }
  };

  const isUserOwner = establishment.users.some(
    (u) => u.uuid === user?.uuid && u.role === "owner"
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Editar Barbearia
            </DialogTitle>
            <DialogDescription>
              Atualize os dados da sua barbearia
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
                    htmlFor="image-upload-edit"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-brand-primary/50 hover:bg-fill-color transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-4 pb-5">
                      <Upload className="w-10 h-10 text-gray-400 mb-2" />
                      <p className="mb-1 text-sm text-gray-500">
                        <span className="font-semibold">
                          Clique para upload
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG (MAX. 5MB)
                      </p>
                    </div>
                    <input
                      id="image-upload-edit"
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
                  disabled={updateEstablishmentMutation.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 gap-2"
                  disabled={updateEstablishmentMutation.isPending}
                >
                  {updateEstablishmentMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Atualizando...
                    </>
                  ) : (
                    <>
                      <Building2 className="w-4 h-4" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </div>

              {isUserOwner && (
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full gap-2"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={deleteEstablishmentMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                  Deletar Barbearia
                </Button>
              )}
            </form>
          </APIProvider>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá permanentemente deletar
              a barbearia e todos os dados associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteEstablishmentMutation.isPending
                ? "Deletando..."
                : "Deletar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EstablishmentEditModal;
