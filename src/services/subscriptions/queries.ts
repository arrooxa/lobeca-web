import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryClient";
import { TIMES } from "@/constants";
import { subscriptionService } from ".";

export const useGetSubscriptionsPlans = (enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.subscriptions.plans,
    queryFn: () => subscriptionService.getAll(),
    staleTime: TIMES.DEFAULT_STALE,
    enabled,
  });
};
