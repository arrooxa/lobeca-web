import { useUser } from "@/context/UserContext";

const Dashboard = () => {
  const { logout } = useUser();

  return (
    <div>
      <p>Dashboard</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
