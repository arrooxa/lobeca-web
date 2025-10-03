import api from "../instance";
import {
  type CreateEstablishmentServiceRequest,
  type CreateWorkerEstablishmentServiceRequest,
  type EstablishmentServiceResponseAPI,
  type EstablishmentServiceWithDetailsResponseAPI,
  mapEstablishmentServiceFromApi,
  mapEstablishmentServiceWithDetailsFromApi,
  mapServiceCategoryFromApi,
  mapWorkerEstablishmentServiceWithDetailsFromApi,
  type PartialEstablishmentServiceResponseAPI,
  type ServiceCategoryResponseAPI,
  type UpdateEstablishmentServiceRequest,
  type WorkerEstablishmentServiceResponseAPI,
  type WorkerEstablishmentServiceWithDetailsResponseAPI,
} from "@/types";

export const serviceService = {
  getAllServicesCategories: async () => {
    try {
      const response = await api.get<ServiceCategoryResponseAPI[]>(`/service`);
      return response.data.map(mapServiceCategoryFromApi);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error trying get all services"
      );
    }
  },

  getCurrentUserServices: async () => {
    try {
      const response = await api.get<
        WorkerEstablishmentServiceWithDetailsResponseAPI[]
      >(`/user/services`);

      return response.data.map(mapWorkerEstablishmentServiceWithDetailsFromApi);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying get services by user ID"
      );
    }
  },

  createEstablishmentService: async (
    data: CreateEstablishmentServiceRequest
  ) => {
    try {
      const response = await api.post<EstablishmentServiceResponseAPI>(
        `/establishment/service`,
        {
          ...data,
          category_id: data.categoryID,
          base_price: data.basePrice,
          duration_minutes: data.duration,
          description: data.description,
        }
      );
      return mapEstablishmentServiceFromApi(response.data);
    } catch (error) {
      console.error("Erro ao criar serviço", error);
      throw new Error(
        error instanceof Error ? error.message : "Error trying create service"
      );
    }
  },

  createWorkerEstablishmentService: async (
    data: CreateWorkerEstablishmentServiceRequest
  ) => {
    try {
      const response = await api.post<WorkerEstablishmentServiceResponseAPI>(
        `/establishment/service/worker`,
        {
          establishment_service_id: data.establishmentServiceID,
          worker_uuid: data.workerUUID,
          custom_price: data.customPrice,
        }
      );

      return response.data;
    } catch (error) {
      console.error("Erro ao vincular serviço ao profissional", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying link service to worker"
      );
    }
  },

  getServiceByID: async ({ serviceID }: { serviceID: number }) => {
    try {
      const response =
        await api.get<EstablishmentServiceWithDetailsResponseAPI>(
          `/service/${serviceID}`
        );

      return mapEstablishmentServiceWithDetailsFromApi(response.data);
    } catch (error) {
      console.error("Erro ao buscar serviço por ID", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying get service by ID"
      );
    }
  },

  updateService: async (
    serviceID: number,
    {
      categoryID,
      duration,
      basePrice,
      description,
      name,
      isActive,
    }: UpdateEstablishmentServiceRequest
  ) => {
    try {
      const response = await api.patch<PartialEstablishmentServiceResponseAPI>(
        `/service/${serviceID}`,
        {
          name,
          category_id: categoryID,
          duration_minutes: duration,
          base_price: basePrice,
          description: description,
          is_active: isActive,
        }
      );

      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar serviço", error);
      throw new Error(
        error instanceof Error ? error.message : "Error trying update service"
      );
    }
  },

  deleteService: async ({ serviceID }: { serviceID: number }) => {
    try {
      const response = await api.delete<PartialEstablishmentServiceResponseAPI>(
        `/service/${serviceID}`
      );

      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error trying delete service"
      );
    }
  },
};
