import { Button, Card, CardContent } from "@/components";
import DashboardLayout from "@/layouts/dashboard";
import { useUser } from "@/context/UserContext";
import { useGetCurrentUserAppointments } from "@/services/appointments/queries";
import { CalendarX2, Plus, Sparkles } from "lucide-react";
import AppointmentCard from "./components/appointment-card.tsx";
import { NavLink, useNavigate } from "react-router";
import { ROUTES } from "@/constants";

const AppointmentsPage = () => {
  const { user, isWorker } = useUser();
  const navigate = useNavigate();

  const {
    data: appointments,
    isLoading: loadingAppointments,
    error: errorAppointments,
  } = useGetCurrentUserAppointments(Boolean(user));

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <h1 className="font-bold text-2xl text-center">
            Faça login para registrar seus agendamentos!
          </h1>
          <Button size="lg" onClick={() => navigate(ROUTES.LOGIN)}>
            Login
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  if (loadingAppointments) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-lg">Carregando agendamentos...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (errorAppointments) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-lg text-red-500">
              Erro ao carregar agendamentos
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-bold text-3xl">Meus agendamentos</h1>
          {isWorker && (
            <Button
              className="gap-2"
              onClick={() => navigate(ROUTES.DASHBOARD_CREATE_CUSTOM_APPOINTMENT)}
            >
              <Plus className="w-4 h-4" />
              Novo agendamento
            </Button>
          )}
        </div>

        {!appointments || appointments.length === 0 ? (
          <Card>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-brand-primary/10 rounded-full blur-2xl animate-pulse" />
                  <div className="relative bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-full p-8">
                    <CalendarX2
                      className="w-20 h-20 text-brand-primary"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  Nenhum agendamento encontrado
                </h3>
                <p className="text-center text-foreground-subtle max-w-md mb-8">
                  {isWorker
                    ? "Você ainda não possui agendamentos registrados. Crie seus horários disponíveis e comece a receber clientes!"
                    : "Dê uma olhada nos barbeiros disponíveis e encontre o seu preferido!"}
                </p>
                <Button size="lg" className="gap-2" asChild>
                  <NavLink
                    to={isWorker ? ROUTES.DASHBOARD_SCHEDULE : ROUTES.HOME}
                  >
                    <Sparkles className="w-5 h-5" />
                    {isWorker ? "Configurar horários" : "Explorar barbeiros"}
                  </NavLink>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.uuid}
                appointment={appointment}
                isWorker={isWorker}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AppointmentsPage;
