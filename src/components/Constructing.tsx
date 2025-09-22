import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Scissors,
  Radar as Razor,
  Bomb as Comb,
  BicepsFlexed,
  MessageSquare,
} from "lucide-react";

export default function UnderConstructionPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 transform rotate-12">
          <Scissors size={120} className="text-brand-primary" />
        </div>
        <div className="absolute top-40 right-32 transform -rotate-45">
          <Razor size={80} className="text-brand-secondary" />
        </div>
        <div className="absolute bottom-32 left-40 transform rotate-45">
          <Comb size={100} className="text-brand-primary" />
        </div>
        <div className="absolute bottom-20 right-20 transform -rotate-12">
          <Scissors size={90} className="text-brand-secondary" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Logo/Brand Area */}
        <img
          src="/lobeca-logo.svg"
          alt="Lobeca Logo"
          className="mx-auto w-60 h-60"
        />

        {/* Main Message */}
        <Card className="bg-card/80 backdrop-blur-sm border-border p-8 md:p-12 mb-8">
          <div className="flex items-center justify-center mb-6">
            <BicepsFlexed size={48} className="text-brand-primary mr-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-card-foreground">
              Estamos em Construção
            </h2>
          </div>

          <p className="text-xl md:text-2xl text-foreground-muted mb-6 text-pretty">
            Estamos preparando uma experiência única para você. Nossa plataforma
            inovadora para barbearias em breve estará disponível.
          </p>

          <p className="text-lg text-foreground-muted mb-8">
            Conectando barbeiros e clientes de forma moderna e eficiente.
          </p>

          {/* Icons Row */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-brand-primary/20 rounded-full flex items-center justify-center mb-2">
                <Scissors size={24} className="text-brand-primary" />
              </div>
              <span className="text-sm text-foreground-muted">
                Agendamentos
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-brand-primary/20 rounded-full flex items-center justify-center mb-2">
                <Razor size={24} className="text-brand-primary" />
              </div>
              <span className="text-sm text-foreground-muted">Gestão</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-brand-primary/20 rounded-full flex items-center justify-center mb-2">
                <Comb size={24} className="text-brand-primary" />
              </div>
              <span className="text-sm text-foreground-muted">Pagamentos</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-brand-primary hover:bg-brand-primary/90 text-foreground-on-secondary"
              onClick={() =>
                window.open("https://wa.me/message/737FGWRL5VVND1", "_blank")
              }
            >
              <MessageSquare className="mr-2" />
              Entre em Contato
            </Button>
          </div>
        </Card>

        <div className="text-center">
          <p className="text-foreground-muted">
            © 2025 Lobeca. Inovação e tecnologia para barbearias modernas.
          </p>
        </div>
      </div>
    </div>
  );
}
