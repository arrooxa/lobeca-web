import { useUser } from "@/context/UserContext";
import DashboardLayout from "@/layouts/dashboard";
import { useGetCurrentUserEstablishment } from "@/services/establishments/queries";
import EstablishmentEmptyState from "./components/establishment-empty-state";
import EstablishmentDetails from "./components/establishment-details";
import { Card, CardContent } from "@/components";

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

  return (
    <DashboardLayout>
      <div className="col-span-12 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-foreground-muted">Minha Barbearia</h1>
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
