import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Heart } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { useGetEstablishments } from "@/services/establishments/queries";
import PublicLayout from "@/layouts/public";

export default function EstablishmentsPage() {
  const [searchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const navigate = useNavigate();

  const {
    data: establishments,
    isLoading,
    isError,
  } = useGetEstablishments({
    limit: 20,
    latitude: lat ? parseFloat(lat) : undefined,
    longitude: lng ? parseFloat(lng) : undefined,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Buscando estabelecimentos...
            </h1>
            <p className="text-muted-foreground">
              Aguarde enquanto encontramos as melhores barbearias próximas a
              você
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-48 bg-muted rounded-md mb-4" />
                  <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !establishments) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Erro</CardTitle>
            <CardDescription>{isError}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")}>
              Voltar para a página inicial
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-balance">
              Barbearias próximas a você
            </h1>
            <p className="text-muted-foreground">
              Encontramos {establishments.length} estabelecimentos na sua região
            </p>
          </div>

          {establishments.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Nenhum estabelecimento encontrado</CardTitle>
                <CardDescription>
                  Não encontramos barbearias próximas à sua localização. Tente
                  buscar em outra região.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate("/")}>Nova busca</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {establishments.map((establishment) => (
                <Card
                  key={establishment.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 bg-muted">
                    <img
                      src={establishment.photoURL || "/placeholder.svg"}
                      alt={establishment.name}
                      className="w-full h-full object-cover"
                    />
                    {/* {establishment.openNow && (
                    <Badge className="absolute top-3 right-3 bg-green-600 text-white">
                      Aberto agora
                    </Badge>
                  )} */}
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl">
                      {establishment.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {establishment.distanceKm} km de distância
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4 fill-brand-secondary text-brand-secondary" />
                        <span className="font-semibold">
                          {establishment.totalRecommendations} Recomendações
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{establishment.address}</span>
                    </div>

                    {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{establishment.phone}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {establishment.services.slice(0, 3).map((service, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div> */}

                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1" size="sm">
                        Ver detalhes
                      </Button>
                      <Button variant="outline" size="sm">
                        <Navigation className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
