import { TIMES } from "@/constants";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: TIMES.DEFAULT_STALE,
      gcTime: TIMES.DEFAULT_GC,
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export const queryKeys = {
  services: {
    all: ["services"] as const,
    lists: () => [...queryKeys.services.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.services.lists(), { filters }] as const,
    details: () => [...queryKeys.services.all, "detail"] as const,
    detail: (serviceId: number) =>
      [...queryKeys.services.details(), serviceId] as const,
  },
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.users.lists(), { filters }] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (userUUID: string) =>
      [...queryKeys.users.details(), userUUID] as const,
    availability: (workerUUID: string, dayOfWeek: number, date: string) =>
      [
        ...queryKeys.users.details(),
        "availability",
        workerUUID,
        dayOfWeek,
        date,
      ] as const,
    me: {
      profile: ["users", "me", "profile"] as const,
      schedule: {
        all: ["users", "me", "schedule"] as const,
        byWeekDay: (weekDay: number) =>
          [...queryKeys.users.me.schedule.all, weekDay] as const,
      },
      appointments: ["users", "me", "appointments"] as const,
      recommendations: ["users", "me", "recommendations"] as const,
      services: ["users", "me", "services"] as const,
      invites: ["users", "me", "invites"] as const,
      establishment: ["users", "me", "establishment"] as const,
    },
  },
  establishments: {
    all: ["establishments"] as const,
    lists: () => [...queryKeys.establishments.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.establishments.lists(), { filters }] as const,
    details: () => [...queryKeys.establishments.all, "detail"] as const,
    detail: (establishmentUUID: string) =>
      [...queryKeys.establishments.details(), establishmentUUID] as const,
  },
  appointments: {
    all: ["appointments"] as const,
    lists: () => [...queryKeys.appointments.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.appointments.lists(), { filters }] as const,
    details: () => [...queryKeys.appointments.all, "detail"] as const,
    detail: (appointmentUUID: string) =>
      [...queryKeys.appointments.details(), appointmentUUID] as const,
  },
  recommendations: {
    all: ["recommendations"] as const,
    lists: () => [...queryKeys.recommendations.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.recommendations.lists(), { filters }] as const,
    details: () => [...queryKeys.recommendations.all, "detail"] as const,
    detail: (recommendationId: number) =>
      [...queryKeys.recommendations.details(), recommendationId] as const,
  },
  subscriptions: {
    all: ["subscriptions"] as const,
    plans: ["subscriptions", "plans"] as const,
  },
} as const;
