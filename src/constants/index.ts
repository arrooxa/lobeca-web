export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
} as const;

export const TIMES = {
  DEFAULT_STALE: 300000, // 5 minutes
  DEFAULT_GC: 600000, // 10 minutes
} as const;
