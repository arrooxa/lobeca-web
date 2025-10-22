import DashboardLayout from "@/layouts/dashboard";
import { useUser } from "@/context/UserContext";
import CustomerDashboard from "./components/customer-dashboard";

const Dashboard = () => {
  const { user } = useUser();

  return (
    <DashboardLayout>
      {user?.typeID === 1 && <CustomerDashboard />}
    </DashboardLayout>
  );
};

export default Dashboard;
