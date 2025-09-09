import { Calendar, MapPin, Star } from "lucide-react";

const Benefits = () => {
  return (
    <section className="py-16 px-4 bg-fill-color/30">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          Por que escolher o Lobeca?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <MapPin className="h-8 w-8 text-brand-primary" />,
              title: "Encontre Próximo a Você",
              description:
                "Localize as melhores barbearias na sua região com facilidade",
            },
            {
              icon: <Star className="h-8 w-8 text-brand-primary" />,
              title: "Avaliações Reais",
              description: "Veja avaliações e comentários de outros clientes",
            },
            {
              icon: <Calendar className="h-8 w-8 text-brand-primary" />,
              title: "Agendamento Fácil",
              description: "Marque seu horário online sem complicações",
            },
          ].map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                {benefit.title}
              </h3>
              <p className="text-foreground-muted text-pretty">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
