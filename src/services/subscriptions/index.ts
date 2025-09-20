import {
  mapSubscriptionPlanFromApi,
  type PartialSubscriptionResponseAPI,
  type SubscriptionRequest,
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

  create: async (data: SubscriptionRequest) => {
    try {
      const response = await api.post<PartialSubscriptionResponseAPI>(
        `/establishment/${data.establishment_id}/subscription/${data.plan_id}`,
        {
          card_token: data.card_token,
          cpf: data.cpf,
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying create subscription with card token"
      );
    }
  },

  update: async (data: SubscriptionRequest) => {
    try {
      const response = await api.patch<PartialSubscriptionResponseAPI>(
        `/establishment/${data.establishment_id}/subscription/${data.plan_id}`,
        {
          card_token: data.card_token,
          cpf: data.cpf,
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying update subscription"
      );
    }
  },

  cancel: async (data: { establishment_id: number }) => {
    try {
      const response = await api.delete(
        `/establishment/${data.establishment_id}/subscription`
      );

      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying delete subscription"
      );
    }
  },
};
