export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  DASHBOARD_SUBSCRIPTION: "/dashboard/subscription",
  DASHBOARD_SUBSCRIPTION_SUCCESS: "/dashboard/subscription/success",
} as const;

export const TIMES = {
  DEFAULT_STALE: 300000, // 5 minutes
  DEFAULT_GC: 600000, // 10 minutes
} as const;
