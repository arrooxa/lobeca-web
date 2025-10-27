import { Card, CardContent } from "@/components/ui/card";
import AvatarIcon from "@/components/AvatarIcon";
import { formatMoney } from "@/utils/money";
import { Phone, Scissors, Info } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import type { PublicWorkerWithDetails } from "@/types";

interface ServiceSelectionStepProps {
  worker: PublicWorkerWithDetails;
  appointmentUUID: string | null;
}

const ServiceSelectionStep = ({
  worker,
  appointmentUUID,
}: ServiceSelectionStepProps) => {
  const navigate = useNavigate();
  const { workerUUID } = useParams<{ workerUUID: string }>();

  const handleServiceSelect = (serviceID: number) => {
    const params = new URLSearchParams();
    params.append("serviceID", serviceID.toString());
    if (appointmentUUID) params.append("appointmentUUID", appointmentUUID);

    navigate(`/agendar/${workerUUID}?${params.toString()}`, { replace: true });
  };

  return (
    <div className="space-y-8">
      {/* Título do step */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary/10 mb-4">
          <Scissors className="w-8 h-8 text-brand-primary" />
        </div>
        <h1 className="text-4xl font-bold">Qual serviço você deseja?</h1>
        <p className="text-lg text-foreground-subtle">
          Escolha o serviço que deseja agendar com {worker.name}
        </p>
      </div>

      {/* Lista de serviços simplificada */}
      <div className="space-y-3 max-w-lg mx-auto">
        {worker.services && worker.services.length > 0 ? (
          worker.services.map((service) => (
            <button
              key={service.id}
              onClick={() => handleServiceSelect(service.id)}
              className="w-full p-6 rounded-2xl border-2 border-gray-200 hover:border-brand-primary hover:shadow-lg transition-all duration-300 bg-card hover:scale-[1.02] active:scale-[0.98] text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-brand-primary transition-colors">
                    {service.serviceName}
                  </h3>
                  {service.duration && (
                    <div className="flex items-center gap-3 text-sm text-foreground-subtle">
                      <span>{service.duration} min</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-brand-primary">
                    R$ {formatMoney(service.customPrice ?? service.basePrice)}
                  </p>
                </div>
              </div>
            </button>
          ))
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <Info className="w-12 h-12 mx-auto text-foreground-subtle" />
                <p className="text-foreground-subtle">
                  Este profissional ainda não possui serviços disponíveis.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Worker info compacto */}
      <div className="max-w-lg mx-auto pt-8 border-t">
        <div className="flex items-center gap-4 justify-center">
          <AvatarIcon
            name={worker.name}
            photoURL={worker.photoURL}
            size="medium"
          />
          <div className="text-left">
            <p className="font-semibold text-lg">{worker.name}</p>
            <p className="text-sm text-foreground-subtle flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {worker.phone}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelectionStep;
