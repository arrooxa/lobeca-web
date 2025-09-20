import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, queryKeys } from "../queryClient";
import { TIMES } from "@/constants";
import { subscriptionService } from ".";
import type { SubscriptionRequest } from "@/types";

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
    mutationFn: (data: SubscriptionRequest) => subscriptionService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.me.establishment,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.establishments.detail(variables.establishment_id),
      });
    },
  });
};

export const useUpdateSubscription = () => {
  return useMutation({
    mutationFn: (data: SubscriptionRequest) => subscriptionService.update(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.me.establishment,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.establishments.detail(variables.establishment_id),
      });
    },
  });
};

export const useCancelSubscription = () => {
  return useMutation({
    mutationFn: (data: { establishmentId: number }) =>
      subscriptionService.cancel({ establishment_id: data.establishmentId }),
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
