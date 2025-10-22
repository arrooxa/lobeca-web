import {
  type AppointmentResponseAPI,
  type AppointmentWithDetailsResponseAPI,
  type CreateAppointmentByWorkerRequest,
  type CreateAppointmentRequest,
  mapAppointmentFromApi,
  mapAppointmentWithDetailsFromApi,
  type PartialAppointmentResponseAPI,
  type UpdateAppointmentRequest,
} from "@/types";
import api from "../instance";

export const appointmentService = {
  create: async (data: CreateAppointmentRequest) => {
    try {
      const response = await api.post<AppointmentResponseAPI>(`/appointment`, {
        worker_establishment_service_id: data.workerEstablishmentServiceID,
        customer_uuid: data.customerUUID,
        scheduled_at: data.scheduledAt,
        paid_at: data.paidAt,
      });

      return mapAppointmentFromApi(response.data);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying create appointment"
      );
    }
  },

  createByWorker: async (
    workerUUID: string,
    data: CreateAppointmentByWorkerRequest
  ) => {
    try {
      const response = await api.post<AppointmentResponseAPI>(
        `/appointment/by-worker`,
        {
          worker_establishment_service_id: data.workerEstablishmentServiceID,
          customer_identification: data.customerIdentification,
          scheduled_at: data.scheduledAt,
          paid_at: data.paidAt,
        }
      );

      return mapAppointmentFromApi(response.data);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying create appointment"
      );
    }
  },

  get: async (appointmentUUID: string) => {
    try {
      const response = await api.get<AppointmentWithDetailsResponseAPI>(
        `/appointment/${appointmentUUID}`
      );
      return mapAppointmentWithDetailsFromApi(response.data);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying to get appointment"
      );
    }
  },

  getCurrentUserAppointments: async () => {
    try {
      const response = await api.get<AppointmentWithDetailsResponseAPI[]>(
        `/user/appointments`
      );
      return response.data.map(mapAppointmentWithDetailsFromApi);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying to get user appointments"
      );
    }
  },

  update: async (appointmentUUID: string, data: UpdateAppointmentRequest) => {
    try {
      const response = await api.patch<PartialAppointmentResponseAPI>(
        `/appointment/${appointmentUUID}`,
        {
          worker_establishment_service_id: data.workerEstablishmentServiceID,
          scheduled_at: data.scheduledAt,
          paid_at: data.paidAt,
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying to update appointment"
      );
    }
  },

  delete: async (appointmentUUID: string) => {
    try {
      const response = await api.delete<PartialAppointmentResponseAPI>(
        `/appointment/${appointmentUUID}`
      );

      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying to delete appointment"
      );
    }
  },
};
