import { Star } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const Testimonials = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          O que nossos clientes dizem
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: "Carlos Silva",
              rating: 5,
              comment:
                "Encontrei uma barbearia incrível perto de casa. O agendamento foi super fácil!",
              avatar: "/man-profile.png",
            },
            {
              name: "João Santos",
              rating: 5,
              comment:
                "Excelente plataforma! As avaliações me ajudaram a escolher o melhor barbeiro.",
              avatar: "/young-man-profile.png",
            },
            {
              name: "Pedro Lima",
              rating: 5,
              comment:
                "Praticidade total. Agora sempre marco meu corte pelo app.",
              avatar: "/professional-man-profile-photo.jpg",
            },
          ].map((testimonial, index) => (
            <Card
              key={index}
              className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {testimonial.name}
                    </h4>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-foreground-warning text-foreground-warning"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-foreground-muted text-pretty">
                  "{testimonial.comment}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
