import { Button } from "./ui/button";
import { NavLink } from "react-router";
import { ROUTES } from "@/constants";
import { useUser } from "@/context/UserContext";

const Header = () => {
  const { user } = useUser();

  return (
    <header className="border-b border-color-border bg-fill-color/95 backdrop-blur supports-[backdrop-filter]:bg-fill-color/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <NavLink to={ROUTES.HOME} className="flex items-center">
          <img
            src="/lobeca-logo.svg"
            alt="Lobeca Logo"
            className="h-8 w-auto"
          />
        </NavLink>
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink
            to={`${ROUTES.HOME}#featured-services`}
            className="text-font-secondary hover:text-brand-secondary transition-colors"
          >
            Serviços
          </NavLink>
          <NavLink
            to={ROUTES.FOR_BARBERS}
            className="text-font-secondary hover:text-brand-secondary transition-colors"
          >
            Para Barbeiros
          </NavLink>
          <NavLink
            to="#footer"
            className="text-font-secondary hover:text-brand-secondary transition-colors"
          >
            Contato
          </NavLink>
        </nav>
        <div className="flex items-center">
          <Button variant="default" asChild>
            <NavLink to={ROUTES.LOGIN}>
              {user ? "Dashboard" : "Faça o login"}
            </NavLink>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
