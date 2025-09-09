import { Button } from "./ui/button";

const CTA = () => {
  return (
    <section className="py-16 px-4 bg-[var(--color-brand-tertiary)] text-[var(--color-foreground-on-tertiary)]">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 text-[var(--color-foreground)]">
          Pronto para começar?
        </h2>
        <p className="text-xl mb-8 max-w-xl mx-auto text-pretty text-[var(--color-foreground-muted)]">
          Junte-se a milhares de clientes satisfeitos e encontre sua barbearia
          ideal hoje mesmo
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="default" size="lg" className="text-lg px-8 py-3">
            Encontrar Barbearias
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-3 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-foreground-on-primary bg-transparent"
          >
            Sou Barbeiro
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
