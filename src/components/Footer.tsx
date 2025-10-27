import { ROUTES, WHATSAPP_WEB_LINK } from "@/constants";
import { NavLink } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-fill-color py-12 px-4" id="footer">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-5 gap-8">
          <div>
            <img
              src="/lobeca-logo.svg"
              alt="Lobeca Logo"
              className="mb-4 w-32"
            />
            <p className="text-foreground-muted text-sm text-pretty">
              Conectando clientes às melhores barbearias e oferecendo
              ferramentas de gestão para barbeiros.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">
              Para Clientes
            </h4>
            <ul className="space-y-2 text-sm text-foreground-muted">
              <li>
                <NavLink
                  to={ROUTES.ESTABLISHMENTS}
                  className="hover:text-foreground transition-colors"
                >
                  Encontrar Barbearias
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={ROUTES.ESTABLISHMENTS}
                  className="hover:text-foreground transition-colors"
                >
                  Agendar Horário
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={ROUTES.ESTABLISHMENTS}
                  className="hover:text-foreground transition-colors"
                >
                  Avaliações
                </NavLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">
              Para Barbeiros
            </h4>
            <ul className="space-y-2 text-sm text-foreground-muted">
              <li>
                <NavLink
                  to={ROUTES.REGISTER}
                  className="hover:text-foreground transition-colors"
                >
                  Cadastrar Barbearia
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={ROUTES.REGISTER}
                  className="hover:text-foreground transition-colors"
                >
                  Ferramentas de Gestão
                </NavLink>
              </li>
              <li>
                <a
                  href={WHATSAPP_WEB_LINK}
                  target="_blank"
                  className="hover:text-foreground transition-colors"
                >
                  Suporte
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Dúvidas</h4>
            <ul className="space-y-2 text-sm text-foreground-muted">
              <li>
                <a
                  href={ROUTES.PRIVACY_POLICY}
                  className="hover:text-foreground transition-colors"
                >
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a
                  href={ROUTES.TERMS_OF_SERVICE}
                  className="hover:text-foreground transition-colors"
                >
                  Termos de uso
                </a>
              </li>
              <li>
                <NavLink
                  to={WHATSAPP_WEB_LINK}
                  target="_blank"
                  className="hover:text-foreground transition-colors"
                >
                  Fale conosco
                </NavLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contato</h4>
            <ul className="space-y-2 text-sm text-foreground-muted">
              <li>
                <NavLink
                  className="hover:text-foreground transition-colors"
                  to="mailto:contato@lobeca.com.br"
                >
                  contato@lobeca.com.br
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="hover:text-foreground transition-colors"
                  target="_blank"
                  to={WHATSAPP_WEB_LINK}
                >
                  (13) 97425-3636
                </NavLink>
              </li>
              <li>Santos, SP</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-color-border mt-8 pt-8 text-center text-sm text-foreground-muted">
          <p>&copy; 2024 Lobeca. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
