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
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters: Record<string, string | number>) =>
      [...queryKeys.users.lists(), { filters }] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (userUUID: string) =>
      [...queryKeys.users.details(), userUUID] as const,
    bySupabaseId: (supabaseId: string) =>
      [...queryKeys.users.all, "supabase", supabaseId] as const,
  },
  establishments: {
    all: ["establishments"] as const,
    lists: () => [...queryKeys.establishments.all, "list"] as const,
    list: (filters: Record<string, string | number>) =>
      [...queryKeys.establishments.lists(), { filters }] as const,
    details: () => [...queryKeys.establishments.all, "detail"] as const,
    detail: (establishmentId: number) =>
      [...queryKeys.establishments.details(), establishmentId] as const,
    byUser: (userUUID: string) =>
      [...queryKeys.establishments.all, "user", userUUID] as const,
  },
} as const;
