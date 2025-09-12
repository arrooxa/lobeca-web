import { useQuery } from "@tanstack/react-query";
import { userService } from ".";
import { queryKeys } from "../queryClient";
import type { AxiosError } from "axios";
import { TIMES } from "@/constants";

export const useGetUser = (enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.users.details(),
    queryFn: () => userService.get(),
    enabled: enabled,
    staleTime: 0,
  });
};

export const useGetUserByUUID = (uid: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.users.detail(uid),
    queryFn: () => userService.getUserByUUID(uid),
    enabled: enabled && Boolean(uid),
    staleTime: TIMES.DEFAULT_STALE,
  });
};

export const useGetUserBySupabaseId = (
  supabaseId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.users.bySupabaseId(supabaseId),
    queryFn: () => userService.getUserBySupabaseId(supabaseId),
    enabled: enabled && !!supabaseId,
    staleTime: TIMES.DEFAULT_STALE,
    retry: (failureCount, error: AxiosError) => {
      if (error?.response?.status === 404) {
        return false;
      }

      return failureCount < 2;
    },
  });
};
