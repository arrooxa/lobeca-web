import { Crosshair, MapPin, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const HeroSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-fill-color to-white">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 text-foreground">
          Conectando você ao melhor da{" "}
          <span className="text-brand-primary">barbearia local</span>
        </h1>
        <p className="text-xl text-foreground-muted mb-8 max-w-2xl mx-auto text-pretty">
          Encontre as melhores barbearias próximas a você e agende seu horário
          com facilidade. Para barbeiros, oferecemos ferramentas completas de
          gestão.
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-subtle h-5 w-5" />
            <Input
              placeholder="Digite seu CEP ou endereço"
              className="pl-10 pr-12 py-3 text-lg"
            />
            <Button
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-3 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-sm text-foreground-muted hover:text-brand-primary hover:bg-brand-primary/5 flex items-center gap-2"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      console.log("[v0] Localização obtida:", position.coords);
                      // Aqui você implementaria a lógica para usar a localização
                    },
                    (error) => {
                      console.log("[v0] Erro ao obter localização:", error);
                    }
                  );
                }
              }}
            >
              <Crosshair className="h-4 w-4" />
              Usar minha localização atual
            </Button>
          </div>
        </div>

        <Button size="lg" className="text-lg px-8 py-3">
          Encontrar Barbearias
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
