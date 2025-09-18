import {
  mapEstablishmentDetailsFromApi,
  mapEstablishmentFromApi,
  mapPublicEstablishmentDetailsFromApi,
  type EstablishmentDetailsResponseAPI,
  type EstablishmentResponseAPI,
  type GetAllEstablishmentParams,
  type PublicEstablishmentDetailsResponseAPI,
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
      const response = await api.get<EstablishmentDetailsResponseAPI>(
        `/user/establishment`
      );

      return mapEstablishmentDetailsFromApi(response.data);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying get current user establishment"
      );
    }
  },
};
