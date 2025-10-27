import { Card, CardContent } from "@/components";
import AvatarIcon from "@/components/AvatarIcon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { AppointmentWithDetails } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, MapPin, Scissors } from "lucide-react";
import { useNavigate } from "react-router";
import { ROUTES } from "@/constants";

interface AppointmentCardProps {
  appointment: AppointmentWithDetails;
  isWorker: boolean;
}

const AppointmentCard = ({ appointment, isWorker }: AppointmentCardProps) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`${ROUTES.DASHBOARD_APPOINTMENTS}/${appointment.uuid}`);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Date and Time Header */}
          <div className="flex items-center gap-2 text-brand-primary">
            <Calendar className="w-5 h-5" />
            <p className="font-bold text-lg">
              {format(
                appointment.scheduledAt,
                "EEEE, dd 'de' MMMM 'às' HH:mm",
                {
                  locale: ptBR,
                }
              )}
            </p>
          </div>

          <Separator />

          {/* Establishment Info */}
          <div className="flex gap-4">
            <AvatarIcon
              name={appointment.establishmentName}
              photoURL={appointment.establishmentPhotoURL}
              size="large"
              format="square"
            />
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-bold text-xl mb-2">
                  {appointment.establishmentName}
                </h3>
                <div className="flex items-center gap-2 text-foreground-subtle">
                  <MapPin className="w-4 h-4" />
                  <p className="text-sm">{appointment.establishmentAddress}</p>
                </div>
              </div>

              {/* Service Info */}
              <div className="flex items-center gap-2 text-foreground-muted">
                <Scissors className="w-4 h-4" />
                <p className="text-sm font-medium">{appointment.serviceName}</p>
                <span className="text-sm">•</span>
                <p className="text-sm font-bold text-brand-primary">
                  R${" "}
                  {(appointment.servicePrice / 100)
                    .toFixed(2)
                    .replace(".", ",")}
                </p>
              </div>

              {/* User Info (Worker or Customer) */}
              <div className="flex items-center gap-3 pt-2">
                <AvatarIcon
                  name={
                    isWorker ? appointment.customerName : appointment.workerName
                  }
                  photoURL={
                    isWorker
                      ? appointment.customerPhotoURL
                      : appointment.workerPhotoURL
                  }
                  size="small"
                />
                <div>
                  <p className="text-xs text-foreground-subtle mb-1">
                    {isWorker ? "Cliente" : "Profissional"}
                  </p>
                  <p className="font-semibold">
                    {isWorker
                      ? appointment.customerName
                      : appointment.workerName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-2">
            <Button onClick={handleViewDetails} variant="outline">
              Ver detalhes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
