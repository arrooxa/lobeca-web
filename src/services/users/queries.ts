import { useQuery } from "@tanstack/react-query";
import { userService } from ".";
import { queryKeys } from "../queryClient";
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
