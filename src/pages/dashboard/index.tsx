// import { useUser } from "@/context/UserContext";
import { Button, Card, CardContent } from "@/components";
import AvatarIcon from "@/components/AvatarIcon";
import DashboardLayout from "@/layouts/dashboard";
import { Calendar, Heart, CalendarX2, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";

const Dashboard = () => {
  // const { user, session, isWorker, isCustomer } = useUser();

  const favoritesBarbers = [
    {
      name: "Lucas Ferreira",
      id: 1,
      photoURL: "/lucas-reis.jpg",
      establishmentName: "Barbearia do Lucas",
    },
    {
      name: "Lucas Ferreira",
      id: 2,
      photoURL: "/lucas-reis.jpg",
      establishmentName: "Barbearia do Lucas",
    },
    {
      name: "Lucas Ferreira",
      id: 3,
      photoURL: "/lucas-reis.jpg",
      establishmentName: "Barbearia do Lucas",
    },
    {
      name: "Lucas Ferreira",
      id: 4,
      photoURL: "/lucas-reis.jpg",
      establishmentName: "Barbearia do Lucas",
    },
  ];

  const appointments = [
    {
      id: 1,
      barberName: "Lucas Ferreira",
      date: new Date(),
      barberPhotoURL: "/lucas-reis.jpg",
    },
    {
      id: 2,
      barberName: "Lucas Ferreira",
      date: new Date(),
      barberPhotoURL: "/lucas-reis.jpg",
    },
    {
      id: 3,
      barberName: "Lucas Ferreira",
      date: new Date(),
      barberPhotoURL: "/lucas-reis.jpg",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 md:grid grid-cols-12 gap-4">
        <div className="col-span-9">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-foreground-muted">Agendamentos</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <Card>
              <CardContent className="flex flex-col justify-between h-full">
                <div>
                  <h2 className="text-3xl font-semibold mb-2">
                    Faça seu primeiro agendamento!
                  </h2>
                  <p className="text-foreground-muted">
                    Explore os serviços oferecidos por nossos barbeiros e agende
                    um horário que se encaixe na sua agenda.
                  </p>
                </div>
                <Button className="w-full mt-4" size="lg">
                  Agendar agora
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col justify-between h-full">
                <div>
                  <h2 className="text-3xl font-semibold mb-2">Total</h2>
                  <h3 className="text-6xl font-semibold">3</h3>
                </div>
                <p className="text-foreground-subtle">agendamentos</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="flex flex-col justify-between h-full">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-3xl mb-6">
                  Histórico de Agendamentos
                </h2>
                {/* <NavLink className="underline text-foreground-subtle" to={""}>
                  Ver mais
                </NavLink> */}
              </div>
              {appointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-brand-primary/10 rounded-full blur-2xl animate-pulse" />
                    <div className="relative bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-full p-6">
                      <CalendarX2
                        className="w-16 h-16 text-brand-primary"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Nenhum agendamento ainda
                  </h3>
                  <p className="text-center text-foreground-subtle max-w-sm mb-6">
                    Comece sua jornada agendando seu primeiro horário com um de
                    nossos profissionais.
                  </p>
                  <Button size="lg" className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    Fazer primeiro agendamento
                  </Button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {appointments.map((appointment, index) => (
                    <li key={appointment.id}>
                      <div className="p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-brand-primary/20 group">
                        <div className="flex gap-3">
                          <AvatarIcon
                            name={appointment.barberName}
                            photoURL={appointment.barberPhotoURL}
                            size="small"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-brand-primary transition-colors">
                              {appointment.barberName}
                            </h3>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-brand-primary" />
                              <p className="text-foreground-subtle">
                                {format(
                                  appointment.date,
                                  "EEEE, d 'de' MMMM 'de' yyyy, 'às' HH:mm",
                                  { locale: ptBR }
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < appointments.length - 1 && (
                        <Separator className="my-4" />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="col-span-3">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-foreground-muted">Favoritos</h1>
          </div>
          <Card>
            <CardContent>
              <h2 className="font-semibold text-3xl mb-6">
                Barbeiros favoritos
              </h2>
              {favoritesBarbers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-brand-secondary/10 rounded-full blur-xl animate-pulse" />
                    <div className="relative bg-gradient-to-br from-brand-secondary/20 to-brand-primary/20 rounded-full p-6">
                      <Heart
                        className="w-12 h-12 text-brand-secondary"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                    Sem favoritos ainda
                  </h3>
                  <p className="text-center text-foreground-subtle text-sm max-w-xs">
                    Adicione seus barbeiros favoritos para acessá-los
                    rapidamente.
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {favoritesBarbers.map((barber, index) => (
                    <li key={barber.id}>
                      <div className="flex justify-between items-center p-2 rounded-lg">
                        <div className="flex items-center gap-3">
                          <AvatarIcon
                            name={barber.name}
                            photoURL={barber.photoURL}
                            size="extra-small"
                          />
                          <div>
                            <h3 className="font-semibold text-sm group-hover:text-brand-primary transition-colors">
                              {barber.name}
                            </h3>
                            <p className="text-foreground-subtle text-xs">
                              {barber.establishmentName}
                            </p>
                          </div>
                        </div>
                        <button
                          className="p-2 rounded-full hover:bg-brand-secondary/10 transition-all duration-200"
                          aria-label="Remover dos favoritos"
                        >
                          <Heart className="w-5 h-5 text-brand-secondary fill-brand-secondary group-hover:scale-110 transition-transform cursor-pointer" />
                        </button>
                      </div>
                      {index < favoritesBarbers.length - 1 && (
                        <Separator className="mt-2" />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
