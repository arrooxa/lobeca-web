import "./App.css";
import { Route, Routes } from "react-router";
import { ROUTES } from "./constants";
import Dashboard from "./pages/dashboard";
import { ProtectedRoute } from "./components";
import SubscriptionPage from "./pages/dashboard/subscription";
import SubscriptionCheckout from "./pages/dashboard/subscription-checkout";
import SubscriptionSuccess from "./pages/dashboard/subscription-success";
import PrivacyPolicy from "./pages/privacy-policy";
import TermsOfService from "./pages/terms-of-service";
import Homepage from "./pages/home";
import Loginpage from "./pages/login";
import ForBarbers from "./pages/for-barbers";

function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Homepage />} />
      <Route path={ROUTES.LOGIN} element={<Loginpage />} />
      <Route path={ROUTES.FOR_BARBERS} element={<ForBarbers />} />
      <Route path={ROUTES.TERMS_OF_SERVICE} element={<TermsOfService />} />
      <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicy />} />

      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route
          path={ROUTES.DASHBOARD_SUBSCRIPTION}
          element={<SubscriptionPage />}
        />
        <Route
          path={ROUTES.DASHBOARD_SUBSCRIPTION_CHECKOUT}
          element={<SubscriptionCheckout />}
        />
        <Route
          path={ROUTES.DASHBOARD_SUBSCRIPTION_SUCCESS}
          element={<SubscriptionSuccess />}
        />
      </Route>

      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

export default App;
