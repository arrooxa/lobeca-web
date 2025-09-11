import { Scissors } from "lucide-react";
import { Button } from "./ui/button";
import { NavLink } from "react-router";
import { ROUTES } from "@/constants";

const Header = () => {
  return (
    <header className="border-b border-color-border bg-fill-color/95 backdrop-blur supports-[backdrop-filter]:bg-fill-color/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Scissors className="h-8 w-8 text-brand-secondary" />
          <span className="text-2xl font-bold text-font-primary">Lobeca</span>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a
            href="#featured-services"
            className="text-font-secondary hover:text-brand-secondary transition-colors"
          >
            Serviços
          </a>
          <a
            href="#for-barbers"
            className="text-font-secondary hover:text-brand-secondary transition-colors"
          >
            Para Barbeiros
          </a>
          <a
            href="#footer"
            className="text-font-secondary hover:text-brand-secondary transition-colors"
          >
            Contato
          </a>
        </nav>
        <div className="flex items-center">
          <Button variant="default">
            <NavLink to={ROUTES.LOGIN}>Já sou barbeiro</NavLink>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
