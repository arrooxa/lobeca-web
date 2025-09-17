import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components";
import DashboardLayout from "@/layouts/dashboard";
import { useNavigate } from "react-router";
import { ROUTES } from "@/constants";

const Dashboard = () => {
  const { user, session, logout, isWorker, isCustomer } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME, { replace: true });
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">
                Informações do Usuário
              </h2>
              <div className="space-y-2">
                <p>
                  <strong>Nome:</strong> {user?.name || "N/A"}
                </p>
                <p>
                  <strong>Telefone:</strong> {user?.phone || "N/A"}
                </p>
                <p>
                  <strong>Tipo:</strong>{" "}
                  {isWorker
                    ? "Prestador"
                    : isCustomer
                    ? "Cliente"
                    : "Indefinido"}
                </p>
                <p>
                  <strong>ID Supabase:</strong> {user?.supabaseID || "N/A"}
                </p>
                <p>
                  <strong>Ativo:</strong> {user?.isActive ? "Sim" : "Não"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">Sessão Supabase</h2>
              <div className="space-y-2">
                <p>
                  <strong>Usuário ID:</strong> {session?.user?.id || "N/A"}
                </p>
                <p>
                  <strong>Telefone confirmado:</strong>{" "}
                  {session?.user?.phone_confirmed_at ? "Sim" : "Não"}
                </p>
                <p>
                  <strong>Expires em:</strong>{" "}
                  {session?.expires_at
                    ? new Date(session.expires_at * 1000).toLocaleString()
                    : "N/A"}
                </p>
                <p>
                  <strong>Token Type:</strong> {session?.token_type || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">Debug Info</h2>
            <div className="space-y-2 text-sm">
              <p>
                <strong>User Object:</strong>
              </p>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
              <p>
                <strong>Session Object:</strong>
              </p>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
