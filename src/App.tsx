import "./App.css";
import { Route, Routes } from "react-router";
import Homepage from "./pages/Home";
import { ROUTES } from "./constants";
import Loginpage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { ProtectedRoute } from "./components";
import SubscriptionPage from "./pages/Dashboard/subscription";

function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Homepage />} />
      <Route path={ROUTES.LOGIN} element={<Loginpage />} />

      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route
          path={ROUTES.DASHBOARD_SUBSCRIPTION}
          element={<SubscriptionPage />}
        />
      </Route>

      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

export default App;
