import { useMutation, useQuery } from "@tanstack/react-query";

import { recommendationsService } from ".";
import { queryClient, queryKeys } from "../queryClient";
import { TIMES } from "@/constants";

export const useGetCurrentUserRecommendations = (enabled: boolean) => {
  return useQuery({
    queryKey: queryKeys.users.me.recommendations,
    queryFn: () => recommendationsService.getUserRecommendations(),
    staleTime: TIMES.DEFAULT_GC,
    enabled,
  });
};

export const useCreateUserRecommendation = () => {
  return useMutation({
    mutationFn: (data: { workerUUID: string }) =>
      recommendationsService.createUserRecommendation(data.workerUUID),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.me.recommendations,
      });
    },
  });
};

export const useDeleteRecommendationByID = () => {
  return useMutation({
    mutationFn: (recommendationId: number) =>
      recommendationsService.deleteByID(recommendationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.recommendations.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.me.recommendations,
      });
    },
  });
};
