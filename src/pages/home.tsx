import { Button, Card, CardContent, Input } from "@/components";
import UnderConstructionPage from "@/components/Constructing";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ROUTES } from "@/constants";
import { Calendar, Crosshair, MapPin, Search, Star } from "lucide-react";
import { NavLink } from "react-router";

const Homepage = () => {
  const isConstructing = false;

  const testimonials = [
    {
      name: "João Tsukamoto",
      rating: 5,
      comment:
        "Encontrei uma barbearia incrível perto de casa. O agendamento foi super fácil!",
      avatar: "/joao-tsukamoto.jpg",
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
      comment: "Praticidade total. Agora sempre marco meu corte pelo app.",
      avatar: "/lucas-reis.jpg",
    },
    {
      name: "Murilo Parma",
      rating: 5,
      comment:
        "Não sei como vivia sem o Lobeca. Encontrei meu barbeiro ideal e nunca mais troquei!",
      avatar: "/murilo-parma.jpg",
    },
  ];

  return isConstructing ? (
    <UnderConstructionPage />
  ) : (
    <>
      <Header />
      <section
        className="py-20 px-4 bg-gradient-to-br from-fill-color to-white"
        id="hero-section"
      >
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
                        console.log(position);

                        console.log(
                          "[v0] Localização obtida:",
                          position.coords
                        );
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
      <section className="py-16 px-4" id="testimonials">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            O que nossos clientes dizem
          </h2>

          <div className="max-w-6xl mx-auto">
            <Carousel
              opts={{
                align: "start",
                loop: true,
                slidesToScroll: 1,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {testimonials.map((testimonial, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <Card className="hover:shadow-lg transition-shadow h-full">
                      <CardContent className="p-6 text-center h-full flex flex-col">
                        <div className="flex flex-col items-center mb-4">
                          <img
                            src={testimonial.avatar || "/placeholder.svg"}
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full mb-3 object-cover"
                          />
                          <div>
                            <h4 className="font-semibold text-base text-foreground mb-2">
                              {testimonial.name}
                            </h4>
                            <div className="flex justify-center">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="h-4 w-4 fill-foreground-warning text-foreground-warning"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-foreground-muted text-sm flex-grow">
                          "{testimonial.comment}"
                        </p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="bg-white shadow-lg hover:bg-fill-color border-color-border" />
              <CarouselNext className="bg-white shadow-lg hover:bg-fill-color border-color-border" />
            </Carousel>
          </div>
        </div>
      </section>
      <section className="py-16 px-4 bg-brand-primary ">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground-on-primary">
            Pronto para começar?
          </h2>
          <p className="text-xl mb-8 max-w-xl mx-auto text-pretty text-foreground-on-secondary">
            Junte-se a milhares de clientes satisfeitos e encontre sua barbearia
            ideal hoje mesmo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink to="#hero-section">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Encontrar Barbearias
              </Button>
            </NavLink>

            <Button
              variant="secondary-outline"
              size="lg"
              className="text-lg px-8 py-3"
              asChild
            >
              <NavLink to={ROUTES.FOR_BARBERS}>Sou Barbeiro</NavLink>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Homepage;
