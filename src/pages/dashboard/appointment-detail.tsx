import { Button, Card, CardContent } from "@/components";
import AvatarIcon from "@/components/AvatarIcon";
import DashboardLayout from "@/layouts/dashboard";
import { useUser } from "@/context/UserContext";
import {
  useDeleteAppointment,
  useGetAppointment,
} from "@/services/appointments/queries";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, MapPin, Phone, Scissors, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { ROUTES } from "@/constants";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-toastify";

const AppointmentDetailPage = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const { isWorker } = useUser();
  const navigate = useNavigate();

  const {
    data: appointment,
    isLoading: isLoadingAppointment,
    error: appointmentError,
  } = useGetAppointment(appointmentId || "", Boolean(appointmentId));

  const deleteAppointmentMutation = useDeleteAppointment();

  const handleCancelAppointment = async () => {
    if (
      !appointmentId ||
      !window.confirm("Tem certeza que deseja cancelar este agendamento?")
    ) {
      return;
    }

    try {
      await deleteAppointmentMutation.mutateAsync(appointmentId);
      toast.success("Agendamento cancelado com sucesso!");
      navigate(ROUTES.DASHBOARD_APPOINTMENTS);
    } catch {
      toast.error(
        "Não foi possível cancelar o agendamento. Tente novamente mais tarde."
      );
    }
  };

  if (isLoadingAppointment) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-lg">Carregando detalhes...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (appointmentError || !appointment) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <p className="text-lg text-red-500">
                Erro ao carregar detalhes do agendamento
              </p>
              <Button onClick={() => navigate(ROUTES.DASHBOARD_APPOINTMENTS)}>
                Voltar para agendamentos
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(ROUTES.DASHBOARD_APPOINTMENTS)}
            className="mb-4"
          >
            ← Voltar
          </Button>
          <h1 className="font-bold text-3xl mb-2">Meus agendamentos</h1>
          <p className="text-foreground-subtle">Detalhes do agendamento</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Informações</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-brand-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-foreground-subtle mb-1">
                        Data e horário
                      </p>
                      <p className="text-lg font-medium">
                        {format(
                          appointment.scheduledAt,
                          "EEEE, dd 'de' MMMM 'de' yyyy",
                          {
                            locale: ptBR,
                          }
                        )}
                      </p>
                      <p className="text-2xl font-bold text-brand-primary">
                        {format(appointment.scheduledAt, "HH:mm", {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <Scissors className="w-5 h-5 text-brand-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-foreground-subtle mb-1">
                        Serviço
                      </p>
                      <p className="text-lg font-medium">
                        {appointment.serviceName}
                      </p>
                      <p className="text-xl font-bold text-brand-primary">
                        R${" "}
                        {(appointment.servicePrice / 100)
                          .toFixed(2)
                          .replace(".", ",")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {isWorker ? "Cliente" : "Profissional"}
              </h2>

              {isWorker && appointment.customerIdentification ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-800 mb-2">
                      Agendamento Personalizado
                    </p>
                    <p className="text-xs text-blue-700">
                      Este é um agendamento criado para um cliente não
                      registrado na plataforma.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 flex items-center justify-center">
                      <span className="text-xl font-bold text-brand-primary">
                        {appointment.customerIdentification
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground-subtle mb-1">
                        Identificação do Cliente
                      </p>
                      <p className="text-lg font-semibold">
                        {appointment.customerIdentification}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4">
                  <AvatarIcon
                    name={
                      isWorker
                        ? appointment.customerName
                        : appointment.workerName
                    }
                    photoURL={
                      isWorker
                        ? appointment.customerPhotoURL
                        : appointment.workerPhotoURL
                    }
                    size="large"
                    format="circle"
                  />
                  <div className="flex-1 space-y-3">
                    <h3 className="text-lg font-bold">
                      {isWorker
                        ? appointment.customerName
                        : appointment.workerName}
                    </h3>
                    <div className="flex items-center gap-2 text-foreground-subtle">
                      <Phone className="w-4 h-4" />
                      <p>
                        {isWorker
                          ? appointment.customerPhone
                          : appointment.workerPhone}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Barbearia</h2>
              <div className="flex gap-4">
                <AvatarIcon
                  name={appointment.establishmentName}
                  photoURL={appointment.establishmentPhotoURL}
                  size="large"
                  format="square"
                />
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-bold">
                    {appointment.establishmentName}
                  </h3>
                  <div className="flex items-center gap-2 text-foreground-subtle">
                    <MapPin className="w-4 h-4" />
                    <p>{appointment.establishmentAddress}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            {/* <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => {
                toast.info("Funcionalidade em desenvolvimento");
              }}
            >
              Remarcar
            </Button> */}
            <Button
              variant="destructive"
              size="lg"
              className="flex-1 gap-2"
              onClick={handleCancelAppointment}
              disabled={deleteAppointmentMutation.isPending}
            >
              <Trash2 className="w-4 h-4" />
              {deleteAppointmentMutation.isPending
                ? "Cancelando..."
                : "Cancelar agendamento"}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentDetailPage;
