import { useUser } from "@/context/UserContext";
import DashboardLayout from "@/layouts/dashboard";
import { useGetCurrentUserEstablishment } from "@/services/establishments/queries";
import EstablishmentEmptyState from "./components/establishment-empty-state";
import EstablishmentDetails from "./components/establishment-details";
import { Card, CardContent } from "@/components";
import { NavLink } from "react-router";
import { ROUTES } from "@/constants";
import type { PublicWorker } from "@/types/user";

const Establishment = () => {
  const { user } = useUser();

  const {
    data: establishment,
    isLoading: loadingEstablishment,
    error: errorEstablishment,
  } = useGetCurrentUserEstablishment(Boolean(user?.establishmentID));

  if (loadingEstablishment) {
    return (
      <DashboardLayout>
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  const isUserOwnerOrManager = establishment?.users.some(
    (worker: PublicWorker) =>
      worker.uuid === user?.uuid &&
      (worker.role === "owner" || worker.role === "manager")
  );

  return (
    <DashboardLayout>
      <div className="col-span-12 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-foreground-muted">Minha Barbearia</h1>
          {user?.establishmentID && isUserOwnerOrManager && (
            <NavLink
              to={ROUTES.DASHBOARD_SUBSCRIPTION}
              className="text-sm text-brand-primary font-medium hover:underline"
            >
              Gerenciar assinatura
            </NavLink>
          )}
        </div>

        {!user?.establishmentID ? (
          <EstablishmentEmptyState />
        ) : establishment ? (
          <EstablishmentDetails establishment={establishment} />
        ) : errorEstablishment ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-foreground-subtle">
                Erro ao carregar informações do estabelecimento.
              </p>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </DashboardLayout>
  );
};

export default Establishment;
