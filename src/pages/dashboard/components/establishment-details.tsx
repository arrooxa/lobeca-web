import { Button, Card, CardContent } from "@/components";
import AvatarIcon from "@/components/AvatarIcon";
import { Separator } from "@/components/ui/separator";
import type { EstablishmentWithDetails, PublicWorker } from "@/types";
import { Edit2, Plus, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import EstablishmentEditModal from "./establishment-edit-modal";
import WorkerInviteModal from "./worker-invite-modal";
import ServiceCreateModal from "./service-create-modal";
import ServiceEditModal from "./service-edit-modal";

interface EstablishmentDetailsProps {
  establishment: EstablishmentWithDetails;
}

const EstablishmentDetails = ({ establishment }: EstablishmentDetailsProps) => {
  const { user } = useUser();

  const [editEstablishmentModalOpen, setEditEstablishmentModalOpen] =
    useState(false);
  const [inviteWorkerModalOpen, setInviteWorkerModalOpen] = useState(false);
  const [createServiceModalOpen, setCreateServiceModalOpen] = useState(false);
  const [editServiceModalOpen, setEditServiceModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );

  const formatRole = (role: string) => {
    switch (role) {
      case "owner":
        return "Proprietário";
      case "manager":
        return "Gerente";
      case "worker":
        return "Funcionário";
      default:
        return role;
    }
  };

  const formatInviteStatus = (status: string) => {
    switch (status) {
      case "pending":
        return "Convite pendente";
      case "accepted":
        return "Convite aceito";
      case "rejected":
        return "Convite recusado";
      default:
        return status;
    }
  };

  const isUserOwnerOrManager = establishment.users.some(
    (worker: PublicWorker) =>
      worker.uuid === user?.uuid &&
      (worker.role === "owner" || worker.role === "manager")
  );

  const establishmentIsTrialing =
    establishment.status === "trial" &&
    Boolean(establishment.trialStartedAt) &&
    Boolean(establishment.trialEndsAt);

  const allPeople = [
    ...establishment.users.map((worker) => ({
      uuid: worker.uuid,
      name: worker.name,
      displayName: worker.nickname || worker.name,
      photoURL: worker.photoURL,
      description: formatRole(worker.role),
      isPending: false,
    })),
    ...establishment.invites
      .filter((invite) => invite.status === "pending")
      .map((invite) => ({
        uuid: invite.inviteeUUID,
        name: invite.inviteeName,
        displayName: invite.inviteeName,
        photoURL: invite.inviteePhotoURL,
        description: formatInviteStatus(invite.status),
        isPending: true,
      })),
  ];

  const handleEditEstablishment = () => {
    setEditEstablishmentModalOpen(true);
  };

  const handleInviteWorker = () => {
    setInviteWorkerModalOpen(true);
  };

  const handleAddService = () => {
    setCreateServiceModalOpen(true);
  };

  const handleEditService = (serviceId: number) => {
    setSelectedServiceId(serviceId);
    setEditServiceModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header with establishment info */}
      <Card>
        <CardContent>
          <div className="flex gap-4 items-start justify-between">
            <div className="flex gap-4 items-center flex-1">
              <AvatarIcon
                name={establishment.name}
                photoURL={establishment.photoURL}
                format="square"
                size="large"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">
                  {establishment.name}
                </h2>
                <p className="text-foreground-subtle">
                  {establishment.address}
                </p>
              </div>
            </div>
            {isUserOwnerOrManager && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleEditEstablishment}
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </Button>
            )}
          </div>

          {establishmentIsTrialing && establishment.trialEndsAt && (
            <div className="mt-4 bg-brand-secondary/20 border border-brand-secondary p-4 rounded-lg">
              <p className="text-brand-secondary font-semibold text-sm">
                O seu período de teste termina em{" "}
                {format(establishment.trialEndsAt, "dd/MM/yyyy", {
                  locale: ptBR,
                })}
                . Atualize seu plano para continuar com seus serviços
                disponíveis na plataforma.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Professionals Section */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Profissionais</h3>
            {isUserOwnerOrManager && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleInviteWorker}
              >
                <UserPlus className="w-4 h-4" />
                Convidar
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allPeople.map((person) => (
              <div
                key={person.uuid}
                className={`flex flex-col items-center text-center p-4 rounded-lg border border-color-border hover:border-brand-primary/20 transition-colors ${
                  person.isPending ? "opacity-60" : ""
                }`}
              >
                <AvatarIcon
                  name={person.name}
                  photoURL={person.photoURL}
                  size="medium"
                  className="mb-3"
                />
                <p className="font-semibold text-sm mb-1">
                  {person.displayName}
                </p>
                <p className="text-xs text-foreground-subtle">
                  {person.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Services Section */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Serviços</h3>
            {isUserOwnerOrManager && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleAddService}
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </Button>
            )}
          </div>

          {establishment.services.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-foreground-subtle">
                Nenhum serviço cadastrado.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {establishment.services.map((service, index) => (
                <div key={service.id}>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-fill-color hover:bg-fill-color/60 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <div>
                        <h4 className="font-bold text-lg">{service.name}</h4>
                        <p className="text-sm text-foreground-subtle">
                          {service.duration} minutos
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold">
                        R${" "}
                        {(service.basePrice / 100).toFixed(2).replace(".", ",")}
                      </span>
                      {isUserOwnerOrManager && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditService(service.id)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {index < establishment.services.length - 1 && (
                    <Separator className="my-2" />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <EstablishmentEditModal
        open={editEstablishmentModalOpen}
        onOpenChange={setEditEstablishmentModalOpen}
        establishment={establishment}
      />

      <WorkerInviteModal
        open={inviteWorkerModalOpen}
        onOpenChange={setInviteWorkerModalOpen}
      />

      <ServiceCreateModal
        open={createServiceModalOpen}
        onOpenChange={setCreateServiceModalOpen}
      />

      {selectedServiceId && (
        <ServiceEditModal
          open={editServiceModalOpen}
          onOpenChange={setEditServiceModalOpen}
          serviceID={selectedServiceId}
        />
      )}
    </div>
  );
};

export default EstablishmentDetails;
