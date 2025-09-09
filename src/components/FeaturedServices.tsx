import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const FeaturedServices = () => {
  return (
    <section className="py-16 px-4">
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
  );
};

export default FeaturedServices;
