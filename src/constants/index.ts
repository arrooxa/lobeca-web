import { Bounce, type ToastOptions } from "react-toastify";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  PRIVACY_POLICY: "/privacy-policy",
  TERMS_OF_SERVICE: "/terms-of-service",
  DASHBOARD: "/dashboard",
  DASHBOARD_SUBSCRIPTION: "/dashboard/subscription",
  DASHBOARD_SUBSCRIPTION_CHECKOUT: "/dashboard/subscription/checkout",
  DASHBOARD_SUBSCRIPTION_SUCCESS: "/dashboard/subscription/success",
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
