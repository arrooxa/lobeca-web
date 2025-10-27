import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Button, Card, CardContent, Input } from "@/components";
import DashboardLayout from "@/layouts/dashboard";
import { useUser } from "@/context/UserContext";
import { updateUserProfileSchema, type UpdateUserProfileData } from "@/types";
import { useUpdateUser } from "@/services";
import { defaultToastProps } from "@/constants";
import {
  Camera,
  Loader2,
  Save,
  User as UserIcon,
  Upload,
  X,
} from "lucide-react";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import { APIProvider } from "@vis.gl/react-google-maps";
import { Label } from "@/components/ui/label";

const SettingsPage = () => {
  const { user, refreshUser } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    user?.photoURL || null
  );
  const updateUserMutation = useUpdateUser();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    register,
    reset,
  } = useForm<UpdateUserProfileData>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      nickname: user?.nickname || "",
      address: user?.address || "",
      location: user?.location || {
        latitude: -23.5505,
        longitude: -46.6333,
      },
    },
  });

  // Atualizar os valores do formulário quando o usuário mudar
  useEffect(() => {
    if (user) {
      console.log("Atualizando formulário com dados do usuário:", {
        nickname: user.nickname,
        address: user.address,
        location: user.location,
      });

      reset({
        nickname: user.nickname || "",
        address: user.address || "",
        location: user.location || {
          latitude: -23.5505,
          longitude: -46.6333,
        },
      });
      setImagePreview(user.photoURL || null);
    }
  }, [user, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error(
          "Por favor, selecione uma imagem válida",
          defaultToastProps
        );
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5MB", defaultToastProps);
        return;
      }

      setSelectedImage(file);
      setValue("image", file, { shouldDirty: true });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(user?.photoURL || null);
    setValue("image", undefined, { shouldDirty: true });
  };

  const createFormData = (data: UpdateUserProfileData): FormData => {
    const formData = new FormData();

    if (data.nickname) {
      formData.append("nickname", data.nickname);
    }
    formData.append("address", data.address);
    formData.append("latitude", data.location.latitude.toString());
    formData.append("longitude", data.location.longitude.toString());

    if (selectedImage) {
      formData.append("photo", selectedImage);
    }

    return formData;
  };

  const onSubmit = async (data: UpdateUserProfileData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const formData = createFormData(data);

      // Debug: visualizar o conteúdo do FormData
      console.log("FormData contents:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      await updateUserMutation.mutateAsync(formData);

      // Atualizar os dados do usuário
      await refreshUser();

      // Limpar a imagem selecionada (mas manter o preview da URL do servidor)
      setSelectedImage(null);

      toast.success("Perfil atualizado com sucesso!", defaultToastProps);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error(
        "Erro ao atualizar perfil. Tente novamente.",
        defaultToastProps
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <h1 className="font-bold text-2xl text-center">
            Você precisa estar logado para acessar as configurações!
          </h1>
        </div>
      </DashboardLayout>
    );
  }

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="font-bold text-3xl mb-2">Configurações</h1>
          <p className="text-foreground-subtle">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {/* Foto do perfil */}
            <Card>
              <CardContent>
                <div className="py-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Foto do Perfil
                  </h2>
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                            onError={() => setImagePreview(null)}
                          />
                          {selectedImage && (
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary flex items-center justify-center">
                          <UserIcon className="w-12 h-12 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="photo-upload" className="cursor-pointer">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-fit">
                          <Upload className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {selectedImage ? "Trocar foto" : "Enviar foto"}
                          </span>
                        </div>
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </Label>
                      <p className="text-sm text-gray-500 mt-2">
                        JPG, PNG ou GIF. Tamanho máximo de 5MB.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações pessoais */}
            <Card>
              <CardContent>
                <div className="py-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <UserIcon className="w-5 h-5" />
                    Informações Pessoais
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome completo</Label>
                      <Input
                        id="name"
                        value={user.name}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Este campo não pode ser alterado
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={user.phone}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Este campo não pode ser alterado
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="nickname">Apelido</Label>
                      <Input
                        id="nickname"
                        {...register("nickname")}
                        placeholder="Como gosta de ser chamado"
                        className={errors.nickname ? "border-red-500" : ""}
                      />
                      {errors.nickname && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.nickname.message}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <APIProvider apiKey={apiKey}>
                        <Controller
                          name="address"
                          control={control}
                          render={({ field }) => (
                            <LocationAutocomplete
                              value={field.value}
                              onChange={field.onChange}
                              onPlaceSelect={(place) => {
                                setValue("address", place.address, {
                                  shouldDirty: true,
                                });
                                setValue(
                                  "location",
                                  {
                                    latitude: place.latitude,
                                    longitude: place.longitude,
                                  },
                                  { shouldDirty: true }
                                );
                              }}
                              error={!!errors.address}
                              errorMessage={errors.address?.message}
                              label="Endereço"
                              placeholder="Digite seu endereço completo"
                              required
                            />
                          )}
                        />
                      </APIProvider>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações da conta */}
            <Card>
              <CardContent>
                <div className="py-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Informações da Conta
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium text-gray-700">
                        Tipo de conta
                      </span>
                      <span className="text-sm text-gray-900">
                        {user.typeID === 1 ? "Cliente" : "Profissional"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium text-gray-700">
                        Status
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          user.isActive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {user.isActive ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                    {user.role && (
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm font-medium text-gray-700">
                          Função
                        </span>
                        <span className="text-sm text-gray-900">
                          {user.role}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium text-gray-700">
                        Recomendações
                      </span>
                      <span className="text-sm text-gray-900">
                        {user.recommendations}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botões de ação */}
            <div className="flex justify-end gap-3">
              <Button
                type="submit"
                disabled={!isDirty || isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Salvar alterações
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
