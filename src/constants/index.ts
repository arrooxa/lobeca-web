import { Bounce, type ToastOptions } from "react-toastify";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/registro",
  PRIVACY_POLICY: "/privacy-policy",
  TERMS_OF_SERVICE: "/terms-of-service",
  FOR_BARBERS: "/para-barbeiros",
  ESTABLISHMENTS: "/estabelecimentos",
  ESTABLISHMENTS_DETAILS: "/estabelecimentos/:id",
  DASHBOARD: "/dashboard",
  DASHBOARD_APPOINTMENTS: "/dashboard/agendamentos",
  DASHBOARD_APPOINTMENT_DETAILS: "/dashboard/agendamentos/:appointmentId",
  DASHBOARD_SCHEDULE: "/dashboard/horarios",
  DASHBOARD_ESTABLISHMENT: "/dashboard/barbearia",
  DASHBOARD_SUBSCRIPTION: "/dashboard/barbearia/assinatura",
  DASHBOARD_SUBSCRIPTION_CHECKOUT: "/dashboard/barbearia/assinatura/checkout",
  DASHBOARD_SUBSCRIPTION_SUCCESS: "/dashboard/barbearia/assinatura/success",
  DASHBOARD_SETTINGS: "/dashboard/configuracoes",
} as const;

export const TIMES = {
  DEFAULT_STALE: 300000, // 5 minutes
  DEFAULT_GC: 600000, // 10 minutes
} as const;

export const defaultToastProps: ToastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
  transition: Bounce,
};

export const WHATSAPP_WEB_LINK = "https://wa.me/message/737FGWRL5VVND1";
