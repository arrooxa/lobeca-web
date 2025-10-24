import DashboardLayout from "@/layouts/dashboard";
import { useUser } from "@/context/UserContext";
import CustomerDashboard from "./components/customer-dashboard";
import BarberDashboard from "./components/barber-dashboard";

const Dashboard = () => {
  const { isCustomer, isWorker } = useUser();

  return (
    <DashboardLayout>
      {isCustomer && <CustomerDashboard />}
      {isWorker && <BarberDashboard />}
    </DashboardLayout>
  );
};

export default Dashboard;
