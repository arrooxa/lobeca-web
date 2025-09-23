import { ROUTES } from "@/constants";
import { Button } from "./ui/button";
import { NavLink } from "react-router";

const CTA = () => {
  return (
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
          <Button variant="outline" size="lg" className="text-lg px-8 py-3">
            Encontrar Barbearias
          </Button>

          <Button
            variant="secondary-outline"
            size="lg"
            className="text-lg px-8 py-3"
            asChild
          >
            <NavLink to={ROUTES.FOR_BARBERS}>Sou barbeiro</NavLink>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
