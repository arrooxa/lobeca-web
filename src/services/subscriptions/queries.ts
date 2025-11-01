import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, queryKeys } from "../queryClient";
import { TIMES } from "@/constants";
import { subscriptionService } from ".";
import type { CreateCheckoutSessionRequest } from "@/types";

export const useGetSubscriptionsPlans = (enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.subscriptions.plans,
    queryFn: () => subscriptionService.getAll(),
    staleTime: TIMES.DEFAULT_STALE,
    enabled,
  });
};

export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: (data: CreateCheckoutSessionRequest) =>
      subscriptionService.createCheckoutSession(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.me.establishment,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.establishments.detail(variables.establishmentUUID),
      });
    },
  });
};

export const useUpdateCheckoutSession = () => {
  return useMutation({
    mutationFn: (data: CreateCheckoutSessionRequest) =>
      subscriptionService.updateCheckoutSession(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.me.establishment,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.establishments.detail(variables.establishmentUUID),
      });
    },
  });
};

export const useCancelSubscription = () => {
  return useMutation({
    mutationFn: (data: { establishmentUUID: string }) =>
      subscriptionService.cancel({
        establishment_uuid: data.establishmentUUID,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.me.establishment,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.establishments.detail(variables.establishmentUUID),
      });
    },
  });
};
