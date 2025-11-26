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
import WorkerRoleModal from "./worker-role-modal";
import WorkerServiceAssignModal from "./worker-service-assign-modal";

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
  const [workerRoleModalOpen, setWorkerRoleModalOpen] = useState(false);
  const [workerServiceAssignModalOpen, setWorkerServiceAssignModalOpen] =
    useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );
  const [selectedWorker, setSelectedWorker] = useState<PublicWorker | null>(
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

  const handleWorkerClick = (workerUUID: string) => {
    if (!isUserOwnerOrManager) return;

    const worker = establishment.users.find((w) => w.uuid === workerUUID);
    if (worker) {
      setSelectedWorker(worker);
      setWorkerRoleModalOpen(true);
    }
  };

  const handleAssignServiceToWorker = (serviceId: number) => {
    setSelectedServiceId(serviceId);
    setWorkerServiceAssignModalOpen(true);
  };

  return (
    <div className="space-y-6">
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
        </CardContent>
      </Card>

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
                onClick={() =>
                  !person.isPending && handleWorkerClick(person.uuid)
                }
                className={`flex flex-col items-center text-center p-4 rounded-lg border border-color-border hover:border-brand-primary/20 transition-colors ${
                  person.isPending ? "opacity-60" : ""
                } ${
                  !person.isPending && isUserOwnerOrManager
                    ? "cursor-pointer"
                    : ""
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
                  <div className="p-4 rounded-lg bg-fill-color hover:bg-fill-color/60 transition-colors">
                    <div className="flex items-center justify-between mb-3">
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
                          {(service.basePrice / 100)
                            .toFixed(2)
                            .replace(".", ",")}
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

                    {/* Workers assigned to this service */}
                    {service.workers && service.workers.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-color-border">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold text-foreground-subtle">
                            Profissionais:
                          </p>
                          {isUserOwnerOrManager && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleAssignServiceToWorker(service.id)
                              }
                              className="text-xs h-7"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Atribuir
                            </Button>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {service.workers.map((worker) => (
                            <div
                              key={worker.id}
                              className="flex items-center gap-2 bg-white rounded-md px-3 py-1.5 border border-color-border"
                            >
                              <AvatarIcon
                                name={worker.workerName}
                                photoURL={worker.workerPhotoURL}
                                size="extra-small"
                              />
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  {worker.workerNickname || worker.workerName}
                                </span>
                                {worker.customPrice && (
                                  <span className="text-xs text-foreground-subtle">
                                    R${" "}
                                    {(worker.customPrice / 100)
                                      .toFixed(2)
                                      .replace(".", ",")}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No workers assigned */}
                    {(!service.workers || service.workers.length === 0) &&
                      isUserOwnerOrManager && (
                        <div className="mt-3 pt-3 border-t border-color-border">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleAssignServiceToWorker(service.id)
                            }
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Atribuir profissional
                          </Button>
                        </div>
                      )}
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

      <EstablishmentEditModal
        open={editEstablishmentModalOpen}
        onOpenChange={setEditEstablishmentModalOpen}
        establishment={establishment}
      />

      <WorkerInviteModal
        open={inviteWorkerModalOpen}
        onOpenChange={setInviteWorkerModalOpen}
        establishment={establishment}
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

      <WorkerRoleModal
        open={workerRoleModalOpen}
        onOpenChange={setWorkerRoleModalOpen}
        worker={selectedWorker}
      />

      {selectedServiceId && (
        <WorkerServiceAssignModal
          open={workerServiceAssignModalOpen}
          onOpenChange={setWorkerServiceAssignModalOpen}
          serviceID={selectedServiceId}
          availableWorkers={establishment.users.filter((worker) => {
            const service = establishment.services.find(
              (s) => s.id === selectedServiceId
            );
            return !service?.workers.some((w) => w.workerUUID === worker.uuid);
          })}
        />
      )}
    </div>
  );
};

export default EstablishmentDetails;
