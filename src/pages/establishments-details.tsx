import { MapPin, Share2, Heart, ChevronLeft, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { NavLink, useNavigate, useParams } from "react-router";
import PublicLayout from "@/layouts/public";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useGetEstablishmentByID } from "@/services/establishments/queries";
import type {
  EstablishmentServiceWithDetails,
  WorkerEstablishmentServiceWithDetails,
} from "@/types";
import { formatMoney } from "@/utils/money";
import { config } from "@/utils";

export default function EstablishmentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: establishment,
    isLoading,
    error,
  } = useGetEstablishmentByID(
    { establishmentID: Number(id) },
    Boolean(id) && isNaN(Number(id)) === false
  );

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-background">
          <div className="bg-card">
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-3xl font-bold">Carregando...</h1>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (error || !establishment) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-background">
          <div className="bg-card">
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-3xl font-bold">
                Estabelecimento não encontrado
              </h1>
              <p className="text-muted-foreground">
                Desculpe, não conseguimos encontrar o estabelecimento que você
                está procurando.
              </p>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-background">
        <div className="bg-card">
          <div className="container mx-auto px-4 py-4">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Voltar para estabelecimentos
            </Button>
          </div>
        </div>
        <div className="container mx-auto px-4 py-6">
          <div className="gap-4 mb-6">
            <div className="relative h-[400px] rounded-xl overflow-hidden">
              <img
                src={establishment.photoURL || "/placeholder.svg"}
                alt={establishment.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      {establishment.name}
                    </h1>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Heart className="h-5 w-5 fill-brand-secondary text-brand-secondary" />
                        <span className="font-semibold text-foreground">
                          {establishment.totalRecommendations}
                        </span>
                        <span>Recomendações</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <Card>
                <CardHeader>
                  <CardTitle>Serviços Disponíveis</CardTitle>
                  <p className="text-sm text-foreground-muted">
                    Clique em um serviço para ver os barbeiros disponíveis e
                    seus preços
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {establishment.services.map((service, index) => (
                      <ServiceItem key={index} service={service} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Localização</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-foreground-subtle mt-1 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium">{establishment.address}</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative w-full h-[200px] rounded-lg overflow-hidden border">
                    <iframe
                      src={`https://www.google.com/maps/embed/v1/place?key=${config.googleMapsApiKey}&q=${establishment.latitude},${establishment.longitude}&language=pt-BR&region=BR`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Localização da barbearia"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-brand-primary text-foreground-on-primary">
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <Heart className="h-8 w-8 mx-auto fill-current" />
                    <div>
                      <p className="font-semibold text-lg mb-1">
                        Gostou da barbearia?
                      </p>
                      <p className="text-sm opacity-90">
                        Selecione um serviço para agendar seu horário
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

function ServiceItem({
  service,
}: {
  service: EstablishmentServiceWithDetails;
}) {
  return (
    <Collapsible>
      <div className="border rounded-lg p-4 border-fill-color hover:border-foreground-subtle transition-colors">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex-1 text-left">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-semibold text-base">{service.name}</p>
                  <p className="text-sm text-font-secondary">
                    {service.duration} min.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-font-secondary">A partir de</p>
                <p className="font-bold text-lg text-primary">
                  R${formatMoney(service.basePrice)}
                </p>
              </div>
              <ChevronDown className="h-5 w-5 text-foreground transition-transform group-data-[state=open]:rotate-180" />
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <Separator className="my-4" />
          <div className="space-y-3">
            <p className="text-sm font-medium text-font-secondary mb-3">
              Barbeiros disponíveis para este serviço:
            </p>
            {service.workers.map(
              (
                barberService: WorkerEstablishmentServiceWithDetails,
                index: number
              ) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-md bg-fill-color/50 hover:bg-fill-color transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={barberService.workerPhotoURL || "/placeholder.svg"}
                        alt={
                          barberService.workerNickname ??
                          barberService.workerName
                        }
                      />
                      <AvatarFallback>
                        {barberService.workerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">
                        {barberService.workerName}
                      </p>
                      <p className="text-xl font-bold text-font-primary">
                        R$
                        {formatMoney(
                          barberService.customPrice ?? barberService.basePrice
                        )}
                      </p>
                    </div>
                  </div>
                  <Button size="default" asChild>
                    <NavLink to={`/agendar/${barberService.workerUUID}`}>
                      Agendar
                    </NavLink>
                  </Button>
                </div>
              )
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
