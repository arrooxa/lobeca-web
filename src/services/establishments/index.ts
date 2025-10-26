import {
  type CreateEstablishmentInviteRequest,
  type EstablishmentInviteResponseAPI,
  type EstablishmentInviteWithDetailsResponseAPI,
  type EstablishmentResponseAPI,
  type EstablishmentWithDetailsResponseAPI,
  type EstablishmentWithSubscriptionResponseAPI,
  type GetAllEstablishmentParams,
  mapEstablishmentFromApi,
  mapEstablishmentInviteFromApi,
  mapEstablishmentInviteWithDetailsFromApi,
  mapEstablishmentWithDetailsFromApi,
  mapEstablishmentWithSubscriptionFromApi,
  mapPublicEstablishmentDetailsFromApi,
  type PublicEstablishmentDetailsResponseAPI,
  type UpdateInviteRequest,
} from "@/types";
import api from "../instance";

export const establishmentService = {
  getAll: async (params?: GetAllEstablishmentParams) => {
    try {
      const response = await api.get<EstablishmentResponseAPI[]>(
        `/establishment`,
        { params }
      );

      return response.data.map(mapEstablishmentFromApi);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying get all establishments"
      );
    }
  },

  getByID: async ({ establishmentID }: { establishmentID: number }) => {
    try {
      const response = await api.get<PublicEstablishmentDetailsResponseAPI>(
        `/establishment/${establishmentID}`
      );

      return mapPublicEstablishmentDetailsFromApi(response.data);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying get establishment by ID"
      );
    }
  },

  getCurrentUserEstablishment: async () => {
    try {
      const response = await api.get<EstablishmentWithDetailsResponseAPI>(
        `/user/establishment`
      );

      return mapEstablishmentWithDetailsFromApi(response.data);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying get current user establishment"
      );
    }
  },

  create: async (formData: FormData) => {
    try {
      const response = await api.post<EstablishmentWithSubscriptionResponseAPI>(
        `/establishment`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return mapEstablishmentWithSubscriptionFromApi(response.data);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying create establishment"
      );
    }
  },

  update: async (establishmentID: number, formData: FormData) => {
    try {
      const response =
        await api.patch<EstablishmentWithSubscriptionResponseAPI>(
          `/establishment/${establishmentID}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

      return mapEstablishmentWithSubscriptionFromApi(response.data);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying update establishment"
      );
    }
  },

  createEstablishmentInvite: async (data: CreateEstablishmentInviteRequest) => {
    try {
      const response = await api.post<EstablishmentInviteResponseAPI>(
        `/establishment/${data.establishmentID}/invite`,
        {
          invitee_uuid: data.inviteeUUID,
          inviter_uuid: data.inviterUUID,
        }
      );

      return mapEstablishmentInviteFromApi(response.data);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying create establishment invite"
      );
    }
  },

  getCurrentUserInvites: async () => {
    try {
      const response = await api.get<
        EstablishmentInviteWithDetailsResponseAPI[]
      >(`/user/invites`);

      return response.data.map(mapEstablishmentInviteWithDetailsFromApi);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error trying get user invites"
      );
    }
  },

  updateInvite: async ({ id, status }: UpdateInviteRequest) => {
    try {
      const response = await api.patch<EstablishmentInviteResponseAPI>(
        `/invite/${id}`,
        {
          status,
        }
      );

      return mapEstablishmentInviteFromApi(response.data);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying update establishment invite"
      );
    }
  },

  delete: async ({ establishmentID }: { establishmentID: number }) => {
    try {
      await api.delete(`/establishment/${establishmentID}`);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying delete establishment"
      );
    }
  },
};
