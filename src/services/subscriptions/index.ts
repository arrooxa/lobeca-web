import {
  mapSubscriptionPlanFromApi,
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
};
