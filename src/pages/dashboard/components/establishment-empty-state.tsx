import { Button, Card, CardContent } from "@/components";
import { Building2, Mail } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetCurrentUserInvites } from "@/services/establishments/queries";
import { useUser } from "@/context/UserContext";
import AvatarIcon from "@/components/AvatarIcon";
import { Separator } from "@/components/ui/separator";
import type { EstablishmentInviteWithDetails } from "@/types";
import { useUpdateInvite } from "@/services/establishments/queries";
import { toast } from "react-toastify";
import EstablishmentCreateModal from "./establishment-create-modal";

const EstablishmentEmptyState = () => {
  const { user, updateUser } = useUser();
  const [showInvites, setShowInvites] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: userInvites, isLoading: isLoadingInvites } =
    useGetCurrentUserInvites(Boolean(user?.uuid && !user?.establishmentID));

  const updateInviteMutation = useUpdateInvite();

  const pendingInvites =
    userInvites?.filter((invite) => invite.status === "pending") || [];

  const handleUpdateInvite = async (
    invite: EstablishmentInviteWithDetails,
    status: "accepted" | "rejected"
  ) => {
    try {
      const response = await updateInviteMutation.mutateAsync({
        id: invite.id,
        status,
      });

      if (status === "accepted") {
        toast.success("Convite aceito com sucesso!");
        updateUser({ establishmentID: response.establishmentID });
        setShowInvites(false);
      } else {
        toast.success("Convite recusado.");
      }
    } catch {
      toast.error("Não foi possível atualizar o convite. Tente novamente.");
    }
  };

  const handleCreateEstablishment = () => {
    setShowCreateModal(true);
  };

  return (
    <>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 px-4">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-brand-primary/10 rounded-full blur-2xl animate-pulse" />
            <div className="relative bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-full p-6">
              <Building2
                className="w-16 h-16 text-brand-primary"
                strokeWidth={1.5}
              />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhuma barbearia cadastrada
          </h3>
          <p className="text-center text-foreground-subtle max-w-sm mb-6">
            Você ainda não faz parte de nenhuma barbearia. Crie uma nova ou
            aguarde um convite.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Button
              size="lg"
              className="gap-2"
              onClick={handleCreateEstablishment}
            >
              <Building2 className="w-4 h-4" />
              Criar Barbearia
            </Button>
            {pendingInvites.length > 0 && (
              <Button
                size="lg"
                variant="outline"
                className="gap-2"
                onClick={() => setShowInvites(true)}
              >
                <Mail className="w-4 h-4" />
                Ver Convites ({pendingInvites.length})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showInvites} onOpenChange={setShowInvites}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Convites Pendentes</DialogTitle>
            <DialogDescription>
              Você tem {pendingInvites.length} convite(s) pendente(s) de
              estabelecimentos.
            </DialogDescription>
          </DialogHeader>

          {isLoadingInvites ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary" />
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              {pendingInvites.map((invite, index) => (
                <div key={invite.id}>
                  <div className="flex gap-4 p-4 rounded-lg border border-color-border hover:border-brand-primary/20 transition-colors">
                    <AvatarIcon
                      name={invite.establishmentName}
                      photoURL={invite.establishmentPhotoURL}
                      format="square"
                      size="large"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">
                        {invite.establishmentName}
                      </h3>
                      <p className="text-sm text-foreground-subtle mb-2">
                        {invite.establishmentAddress}
                      </p>
                      <div className="flex items-center gap-2">
                        <AvatarIcon
                          name={invite.inviterName}
                          photoURL={invite.inviterPhotoURL}
                          size="extra-small"
                        />
                        <span className="text-sm text-foreground-subtle">
                          Convite de <strong>{invite.inviterName}</strong>
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 justify-center">
                      <Button
                        size="sm"
                        onClick={() => handleUpdateInvite(invite, "accepted")}
                        disabled={updateInviteMutation.isPending}
                      >
                        Aceitar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleUpdateInvite(invite, "rejected")}
                        disabled={updateInviteMutation.isPending}
                      >
                        Recusar
                      </Button>
                    </div>
                  </div>
                  {index < pendingInvites.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <EstablishmentCreateModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </>
  );
};

export default EstablishmentEmptyState;
