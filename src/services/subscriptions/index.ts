import {
  mapSubscriptionPlanFromApi,
  type CreateSubscriptionResponse,
  type SubscriptionPlanResponseAPI,
} from "@/types";
import api from "../instance";

export const subscriptionService = {
  getAll: async () => {
    try {
      const response = await api.get<SubscriptionPlanResponseAPI[]>(
        `/subscription/plans`
      );
      return response.data.map(mapSubscriptionPlanFromApi);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying get all establishments"
      );
    }
  },

  createSubscription: async (establishmentId: number, planId: number) => {
    try {
      const response = await api.post<CreateSubscriptionResponse>(
        `/establishment/${establishmentId}/subscription/${planId}`
      );

      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying create subscription"
      );
    }
  },
};
