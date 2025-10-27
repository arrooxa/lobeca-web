import {
  type GetAllWorkerSchedulesResponse,
  type GetUserAvailabilityResponseAPI,
  type GetUserWeeklyScheduleResponse,
  type InsertWorkerScheduleRequest,
  mapAllWorkerSchedulesFromApi,
  mapScheduleFromApi,
  mapUserAvailabilityFromApi,
} from "@/types";
import {
  type GetWorkersParams,
  mapPublicWorkerFromApi,
  mapPublicWorkerWithDetailsFromApi,
  mapUserFromApi,
  type PublicWorkerResponseAPI,
  type PublicWorkerWithDetailsResponseAPI,
  type RegisterUserData,
  type UserResponseAPI,
} from "@/types";

import api from "../instance";

export const userService = {
  getWorkers: async (params?: GetWorkersParams) => {
    try {
      const response = await api.get<PublicWorkerResponseAPI[]>(`/workers`, {
        params,
      });
      return response.data.map(mapPublicWorkerFromApi);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error trying get all users"
      );
    }
  },

  getWorkerInfo: async (uuid: string) => {
    try {
      const response = await api.get<PublicWorkerWithDetailsResponseAPI>(
        `/worker/${uuid}`
      );

      return mapPublicWorkerWithDetailsFromApi(response.data);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error trying get worker info"
      );
    }
  },

  get: async () => {
    try {
      const response = await api.get<UserResponseAPI>(`/user`);
      return mapUserFromApi(response.data);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error trying get user by ID"
      );
    }
  },

  registerUser: async (user: RegisterUserData) => {
    try {
      const response = await api.post<UserResponseAPI>(`/user`, {
        name: user.name,
        phone: user.phone,
        type_id: user.typeID,
      });

      return mapUserFromApi(response.data);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error trying register user"
      );
    }
  },

  getUserBySupabaseId: async (supabaseId: string) => {
    try {
      const response = await api.get<UserResponseAPI>(
        `/user/supabase/${supabaseId}`
      );

      return mapUserFromApi(response.data);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying get user by supabase ID"
      );
    }
  },

  getWorkerSchedule: async ({ weekDay }: { weekDay: number }) => {
    try {
      const response = await api.get<GetUserWeeklyScheduleResponse>(
        `/user/schedule/${weekDay}`
      );
      return mapScheduleFromApi(response.data);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "status" in error.response &&
        error.response.status === 404
      ) {
        return null;
      }

      throw new Error("Error trying get user schedule by week day");
    }
  },

  getAllWorkerSchedules: async () => {
    try {
      const response = await api.get<GetAllWorkerSchedulesResponse>(
        `/user/schedules`
      );
      return mapAllWorkerSchedulesFromApi(response.data);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying get all worker schedules"
      );
    }
  },

  upsertWorkerSchedule: async ({
    weekDay,
    data,
  }: {
    weekDay: number;
    data: InsertWorkerScheduleRequest;
  }) => {
    try {
      const response = await api.patch(`/user/schedule/${weekDay}`, {
        start_time: data.startTime,
        end_time: data.endTime,
        is_active: data.isActive,
        breaks: data.breaks.map((b) => ({
          start_time: b.startTime,
          end_time: b.endTime,
        })),
      });

      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying to upsert worker schedule"
      );
    }
  },

  getUserAvailability: async (
    workerUUID: string,
    dayOfWeek: number,
    date: string
  ) => {
    try {
      const response = await api.get<GetUserAvailabilityResponseAPI>(
        `/worker/${workerUUID}/schedule/${dayOfWeek}/${date}`
      );

      return mapUserAvailabilityFromApi(response.data);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error trying get user availability"
      );
    }
  },

  updateUser: async (data: FormData) => {
    try {
      const response = await api.patch<UserResponseAPI>(`/user`, data);
      return mapUserFromApi(response.data);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error trying update user"
      );
    }
  },

  updateUserRole: async (userUUID: string, role: string) => {
    try {
      const response = await api.patch<{ id: number }>(
        `/user/${userUUID}/role`,
        {
          role,
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error trying update user role"
      );
    }
  },

  delete: async () => {
    try {
      const response = await api.delete(`/user`);
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error trying delete user"
      );
    }
  },
};
