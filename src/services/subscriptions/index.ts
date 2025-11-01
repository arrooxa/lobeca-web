import {
  mapSubscriptionPlanFromApi,
  type CreateCheckoutSessionRequest,
  type CreateCheckoutSessionResponseAPI,
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
          : "Error trying get all subscription plans"
      );
    }
  },

  createCheckoutSession: async (data: CreateCheckoutSessionRequest) => {
    try {
      const response = await api.post<CreateCheckoutSessionResponseAPI>(
        `/establishment/${data.establishmentUUID}/subscription/${data.planID}`,
        {
          successURL: data.successURL,
          cancelURL: data.cancelURL,
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying create checkout session"
      );
    }
  },

  updateCheckoutSession: async (data: CreateCheckoutSessionRequest) => {
    try {
      const response = await api.patch<CreateCheckoutSessionResponseAPI>(
        `/establishment/${data.establishmentUUID}/subscription/${data.planID}`,
        {
          successURL: data.successURL,
          cancelURL: data.cancelURL,
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

  cancel: async (data: { establishment_uuid: string }) => {
    try {
      const response = await api.delete(
        `/establishment/${data.establishment_uuid}/subscription`
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
