import { Calendar, Shield, TrendingUp, Users } from "lucide-react";
import { Button } from "./ui/button";

const ForBarbers = () => {
  return (
    <section className="py-16 px-4 bg-brand-primary text-foreground-on-primary">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground-on-primary">
            Ferramentas Completas para Barbeiros
          </h2>
          <p className="text-xl text-foreground-on-primary/90 max-w-2xl mx-auto text-pretty">
            Gerencie seu negócio, atraia novos clientes e aumente sua receita
            com nossa plataforma
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              icon: <Calendar className="h-8 w-8" />,
              title: "Agenda Online",
              description: "Gerencie horários e agendamentos automaticamente",
            },
            {
              icon: <Users className="h-8 w-8" />,
              title: "Gestão de Clientes",
              description:
                "Mantenha histórico e preferências dos seus clientes",
            },
            {
              icon: <TrendingUp className="h-8 w-8" />,
              title: "Relatórios",
              description:
                "Acompanhe vendas, horários e performance do negócio",
            },
            {
              icon: <Shield className="h-8 w-8" />,
              title: "Pagamentos",
              description: "Receba pagamentos online com segurança",
            },
          ].map((feature, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4 text-foreground-on-primary/90">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground-on-primary">
                {feature.title}
              </h3>
              <p className="text-foreground-on-primary/80 text-sm text-pretty">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="secondary" size="lg" className="text-lg px-8 py-3">
            Cadastrar Minha Barbearia
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ForBarbers;
