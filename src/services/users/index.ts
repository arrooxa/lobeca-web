import { mapUserFromApi, type UserResponseAPI } from "@/types";
import api from "../instance";

export const userService = {
  get: async () => {
    try {
      const response = await api.get<UserResponseAPI>(`api/v1/user`);
      return mapUserFromApi(response.data);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error trying get user"
      );
    }
  },

  getUserByUUID: async (uuid: string) => {
    try {
      const response = await api.get<UserResponseAPI>(`/user/${uuid}`);
      return mapUserFromApi(response.data);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error trying get user by ID"
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
};
