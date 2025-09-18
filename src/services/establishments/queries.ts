import { useQuery } from "@tanstack/react-query";
import { establishmentService } from ".";
import { queryKeys } from "../queryClient";
import type { GetAllEstablishmentParams } from "@/types";
import { TIMES } from "@/constants";

export const useGetEstablishments = (
  params?: GetAllEstablishmentParams,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: params
      ? queryKeys.establishments.list({ ...params })
      : queryKeys.establishments.all,
    queryFn: () => establishmentService.getAll(params),
    staleTime: TIMES.DEFAULT_STALE,
    enabled,
  });
};

export const useGetCurrentUserEstablishment = (enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.users.me.establishment,
    queryFn: () => establishmentService.getCurrentUserEstablishment(),
    staleTime: TIMES.DEFAULT_STALE,
    enabled,
  });
};

export const useGetEstablishmentByID = (
  { establishmentID }: { establishmentID: number },
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.establishments.detail(establishmentID),
    queryFn: () => establishmentService.getByID({ establishmentID }),
    staleTime: TIMES.DEFAULT_STALE,
    enabled: enabled && Boolean(establishmentID),
  });
};
