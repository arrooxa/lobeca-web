import {
  type GetUserRecommendationsResponseAPI,
  mapGetUserRecommendationsFromAPI,
  mapUserRecommendationFromApi,
  type UserRecommendationResponseAPI,
} from "@/types";
import api from "../instance";

export const recommendationsService = {
  getUserRecommendations: async () => {
    try {
      const response = await api.get<GetUserRecommendationsResponseAPI[]>(
        `/user/recommendations`
      );

      return response.data.map(mapGetUserRecommendationsFromAPI);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying get user recommendations"
      );
    }
  },

  createUserRecommendation: async (workerUUID: string) => {
    try {
      const response = await api.post<UserRecommendationResponseAPI>(
        `/user/recommendation`,
        {
          worker_uuid: workerUUID,
        }
      );

      return mapUserRecommendationFromApi(response.data);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying create user recommendation"
      );
    }
  },

  deleteByID: async (recommendationId: number) => {
    try {
      const response = await api.delete<UserRecommendationResponseAPI>(
        `recommendation/${recommendationId}`
      );

      return mapUserRecommendationFromApi(response.data);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying delete recommendation by id"
      );
    }
  },
};
