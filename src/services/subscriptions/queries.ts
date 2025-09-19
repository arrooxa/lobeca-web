import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, queryKeys } from "../queryClient";
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

export const useCreateSubscription = () => {
  return useMutation({
    mutationFn: ({
      establishmentId,
      planId,
    }: {
      establishmentId: number;
      planId: number;
    }) => subscriptionService.createSubscription(establishmentId, planId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.me.establishment,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.establishments.detail(variables.establishmentId),
      });
    },
  });
};
