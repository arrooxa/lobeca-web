import { Button, Card, CardContent, Input } from "@/components";
import UnderConstructionPage from "@/components/Constructing";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Calendar, Crosshair, MapPin, Search, Star } from "lucide-react";

const Homepage = () => {
  const isConstructing = false;

  return isConstructing ? (
    <UnderConstructionPage />
  ) : (
    <>
      <Header />
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
                        console.log(
                          "[v0] Localização obtida:",
                          position.coords
                        );
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
      <section className="py-16 px-4" id="featured-services">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Serviços Populares
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Corte Tradicional",
                price: "R$ 25-45",
                image: "/traditional-barber-haircut.jpg",
              },
              {
                name: "Barba & Bigode",
                price: "R$ 20-35",
                image: "/beard-trim-barber-shop.jpg",
              },
              {
                name: "Corte + Barba",
                price: "R$ 40-70",
                image: "/haircut-and-beard-combo-barber.jpg",
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-shadow max-w-sm mx-auto"
              >
                <div className="aspect-[4/3] bg-fill-color">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 text-foreground">
                    {service.name}
                  </h3>
                  <p className="text-foreground-muted mb-4">{service.price}</p>
                  <Button
                    variant="outline"
                    size="default"
                    className="w-full hover:bg-brand-primary hover:text-foreground-on-primary hover:border-brand-primary"
                  >
                    Ver Barbearias
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
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
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            O que nossos clientes dizem
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "João Tsukamoto",
                rating: 5,
                comment:
                  "Encontrei uma barbearia incrível perto de casa. O agendamento foi super fácil!",
                avatar:
                  "https://scontent.cdninstagram.com/v/t51.75761-15/480765801_18490497022009746_1367201398027017295_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=103&cb=30a688f7-8c7f5fbb&ig_cache_key=MzU3MTAxNTAyNjM3NjgxNTMxNg%3D%3D.3-ccb1-7-cb30a688f7-8c7f5fbb&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMC5zZHIuQzMifQ%3D%3D&_nc_ohc=RRjbpVDqZ00Q7kNvwHY0mCT&_nc_oc=Admiy3-P5VjXlXSYmUUkR-RoP55Szzp80OmOYfP1y3lxjIwIgUH7CHuSd72pwCjnfqnB5e6EEOGkEVAmZHlBzXVh&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=LXyGxeWsvaFgDFyU9ZbNgQ&oh=00_AfYzMctoD624drsu1wocgDciR4gKgguh0KuYCrPm_WuAVQ&oe=68D7B388",
              },
              {
                name: "Renan Antunes",
                rating: 5,
                comment:
                  "Excelente plataforma! As avaliações me ajudaram a escolher o melhor barbeiro.",
                avatar: "/renan-antunes.jpg",
              },
              {
                name: "Lucas Reis",
                rating: 5,
                comment:
                  "Praticidade total. Agora sempre marco meu corte pelo app.",
                avatar: "lucas-reis.jpg",
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
                      className="w-12 h-12 rounded-full mr-3 object-cover"
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
      <CTA />
      <Footer />
    </>
  );
};

export default Homepage;
