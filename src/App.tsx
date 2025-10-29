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
import RegisterPage from "./pages/register";
import ForBarbers from "./pages/for-barbers";
import EstablishmentsPage from "./pages/establishments";
import EstablishmentsDetails from "./pages/establishments-details";
import Schedule from "./pages/dashboard/schedule";
import Establishment from "./pages/dashboard/establishment";
import AppointmentsPage from "./pages/dashboard/appointments";
import AppointmentDetailPage from "./pages/dashboard/appointment-detail";
import CreateCustomAppointmentPage from "./pages/dashboard/create-custom-appointment";
import BookingPage from "./pages/booking";
import SettingsPage from "./pages/dashboard/settings";

function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Homepage />} />
      <Route path={ROUTES.ESTABLISHMENTS} element={<EstablishmentsPage />} />
      <Route
        path={ROUTES.ESTABLISHMENTS_DETAILS}
        element={<EstablishmentsDetails />}
      />
      <Route path={ROUTES.LOGIN} element={<Loginpage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTES.FOR_BARBERS} element={<ForBarbers />} />
      <Route path={ROUTES.TERMS_OF_SERVICE} element={<TermsOfService />} />
      <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicy />} />

      <Route path="/agendar/:workerUUID" element={<BookingPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route
          path={ROUTES.DASHBOARD_APPOINTMENTS}
          element={<AppointmentsPage />}
        />
        <Route
          path={ROUTES.DASHBOARD_APPOINTMENT_DETAILS}
          element={<AppointmentDetailPage />}
        />
        <Route
          path={ROUTES.DASHBOARD_CREATE_CUSTOM_APPOINTMENT}
          element={<CreateCustomAppointmentPage />}
        />
        <Route path={ROUTES.DASHBOARD_SCHEDULE} element={<Schedule />} />
        <Route
          path={ROUTES.DASHBOARD_ESTABLISHMENT}
          element={<Establishment />}
        />
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
        <Route path={ROUTES.DASHBOARD_SETTINGS} element={<SettingsPage />} />
      </Route>

      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

export default App;
