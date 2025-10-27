import { Button } from "@/components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@/context/UserContext";
import { useCreateEstablishmentInvite } from "@/services/establishments/queries";
import { useGetAllWorkers } from "@/services/users/queries";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Search } from "lucide-react";
import { useState, useMemo } from "react";
import type { PublicWorker } from "@/types";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebounce } from "@/hooks/useDebounce";

const inviteSchema = z.object({
  inviteeUUID: z.string().min(1, "Selecione um trabalhador"),
});

type InviteFormData = z.infer<typeof inviteSchema>;

interface WorkerInviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WorkerInviteModal = ({ open, onOpenChange }: WorkerInviteModalProps) => {
  const { user } = useUser();
  const createInviteMutation = useCreateEstablishmentInvite();

  const [searchText, setSearchText] = useState("");
  const [selectedWorker, setSelectedWorker] = useState<PublicWorker | null>(
    null
  );
  const debouncedSearch = useDebounce(searchText, 300);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
  });

  const {
    data: workers = [],
    isLoading,
    error: workersError,
  } = useGetAllWorkers(
    {
      limit: 20,
      name: debouncedSearch || undefined,
      has_establishment: false,
    },
    Boolean(user?.establishmentID && open)
  );

  const filteredWorkers = useMemo(() => {
    if (!searchText.trim()) return workers;
    return workers.filter((worker) =>
      worker.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [workers, searchText]);

  const handleSelectWorker = (worker: PublicWorker) => {
    setSelectedWorker(worker);
    setValue("inviteeUUID", worker.uuid);
    setSearchText("");
  };

  const handleClose = () => {
    reset();
    setSearchText("");
    setSelectedWorker(null);
    onOpenChange(false);
  };

  const onSubmit = async (data: InviteFormData) => {
    if (!user || !user.establishmentID) {
      toast.error("Você precisa estar vinculado a um estabelecimento");
      return;
    }

    try {
      await createInviteMutation.mutateAsync({
        establishmentID: user.establishmentID,
        inviterUUID: user.uuid,
        inviteeUUID: data.inviteeUUID,
        status: "pending",
      });

      toast.success("Convite enviado com sucesso!");
      handleClose();
    } catch (error) {
      console.error("Error creating invite:", error);
      toast.error(
        "Não foi possível enviar o convite. Tente novamente mais tarde."
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Convidar Trabalhador
          </DialogTitle>
          <DialogDescription>
            Busque e convide um profissional para trabalhar na sua barbearia
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {selectedWorker && (
            <div className="p-4 bg-brand-tertiary/20 rounded-lg border border-brand-primary/20">
              <p className="text-sm text-foreground-subtle mb-2">
                Trabalhador selecionado:
              </p>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={selectedWorker.photoURL}
                    alt={selectedWorker.name}
                  />
                  <AvatarFallback>
                    {selectedWorker.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{selectedWorker.name}</p>
                  {selectedWorker.nickname && (
                    <p className="text-sm text-foreground-subtle">
                      @{selectedWorker.nickname}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedWorker(null);
                    setValue("inviteeUUID", "");
                  }}
                >
                  Alterar
                </Button>
              </div>
            </div>
          )}

          {!selectedWorker && (
            <div className="space-y-2">
              <Label htmlFor="worker-search">
                Buscar profissional
                <span className="text-brand-secondary ml-1">*</span>
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="worker-search"
                  placeholder="Digite o nome do profissional..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-10"
                  error={Boolean(errors.inviteeUUID)}
                />
              </div>
              {errors.inviteeUUID && (
                <p className="text-sm text-brand-secondary">
                  {errors.inviteeUUID.message}
                </p>
              )}

              {searchText && (
                <ScrollArea className="h-[300px] border border-color-border rounded-md">
                  {isLoading ? (
                    <div className="p-8 text-center text-foreground-subtle">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto mb-2" />
                      Buscando profissionais...
                    </div>
                  ) : workersError ? (
                    <div className="p-8 text-center text-brand-secondary">
                      Erro ao buscar profissionais
                    </div>
                  ) : filteredWorkers.length === 0 ? (
                    <div className="p-8 text-center text-foreground-subtle">
                      Nenhum profissional encontrado
                    </div>
                  ) : (
                    <div className="p-2">
                      {filteredWorkers.map((worker) => (
                        <button
                          key={worker.uuid}
                          type="button"
                          onClick={() => handleSelectWorker(worker)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-fill-color transition-colors"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={worker.photoURL}
                              alt={worker.name}
                            />
                            <AvatarFallback>
                              {worker.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 text-left">
                            <p className="font-medium">{worker.name}</p>
                            {worker.nickname && (
                              <p className="text-sm text-foreground-subtle">
                                @{worker.nickname}
                              </p>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              )}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              💡 <strong>Dica:</strong> O convite será enviado para o
              profissional e ele poderá aceitar ou recusar.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={createInviteMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 gap-2"
              disabled={createInviteMutation.isPending || !selectedWorker}
            >
              {createInviteMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Enviando...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Enviar Convite
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WorkerInviteModal;
