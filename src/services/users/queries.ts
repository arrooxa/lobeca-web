import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { type InsertWorkerScheduleRequest } from "@/types";
import {
  type GetWorkersParams,
  type RegisterUserData,
  type UpdateUserRequest,
  type User,
} from "@/types";

import { userService } from ".";
import { queryKeys } from "../queryClient";
import { TIMES } from "@/constants";

// ========== QUERIES BASEADAS EM JWT (USUÁRIO LOGADO) ==========

export const useGetCurrentUser = (enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.users.me.profile,
    queryFn: () => userService.get(),
    enabled,
    staleTime: TIMES.DEFAULT_STALE,
  });
};

export const useGetCurrentUserScheduleByWeekDay = (
  weekDay: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.users.me.schedule.byWeekDay(weekDay),
    queryFn: () => userService.getWorkerSchedule({ weekDay }),
    enabled: enabled && weekDay >= 0 && weekDay <= 6,
    staleTime: 0,
    retry: (failureCount, error: AxiosError) => {
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useGetAllCurrentUserSchedules = (enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.users.me.schedule.all,
    queryFn: () => userService.getAllWorkerSchedules(),
    enabled,
    staleTime: TIMES.DEFAULT_STALE,
  });
};

export const useGetUserAvailability = (
  workerUUID: string,
  dayOfWeek: number,
  date: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.users.availability(workerUUID, dayOfWeek, date),
    queryFn: () => userService.getUserAvailability(workerUUID, dayOfWeek, date),
    enabled: enabled && Boolean(date),
    staleTime: TIMES.DEFAULT_STALE,
  });
};

export const useUpsertCurrentUserSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      weekDay,
      data,
    }: {
      weekDay: number;
      data: InsertWorkerScheduleRequest;
    }) => userService.upsertWorkerSchedule({ weekDay, data }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.me.schedule.byWeekDay(variables.weekDay),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.me.schedule.all,
      });
    },
  });
};

// Alias for backward compatibility
export const useInsertCurrentUserSchedule = useUpsertCurrentUserSchedule;

export const useUpdateCurrentUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateData: UpdateUserRequest) =>
      userService.updateUser(updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.me.profile,
      });
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { workerUUID: string; role: string }) =>
      userService.updateUserRole(data.workerUUID, data.role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(variables.workerUUID),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.me.establishment,
      });
    },
  });
};

// ========== QUERIES PARA OUTROS USUÁRIOS (PUBLIC DATA) ==========

export const useGetAllWorkers = (
  params?: GetWorkersParams,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: params
      ? queryKeys.users.list({ ...params })
      : queryKeys.users.all,
    queryFn: () => userService.getWorkers(params),
    enabled,
    staleTime: TIMES.DEFAULT_STALE,
  });
};

export const useGetWorkerInfo = (uuid: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.users.detail(uuid),
    queryFn: () => userService.getWorkerInfo(uuid),
    enabled: enabled && Boolean(uuid),
    staleTime: TIMES.DEFAULT_STALE,
  });
};

export const useRegisterUser = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, RegisterUserData>({
    mutationFn: (data: RegisterUserData) => userService.registerUser(data),
    onSuccess: (user: User) => {
      if (user) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.users.all,
        });

        queryClient.invalidateQueries({
          queryKey: queryKeys.users.me.profile,
        });

        queryClient.invalidateQueries({
          queryKey: queryKeys.users.lists(),
        });

        queryClient.invalidateQueries({
          queryKey: queryKeys.users.detail(user.uuid),
        });
      }
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userService.delete(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.me.profile,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.all,
      });
    },
  });
};

export const useRefreshUsers = () => {
  const queryClient = useQueryClient();

  const refreshCurrentUser = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.users.me.profile,
    });
  };

  const refreshCurrentUserSchedule = (weekDay?: number) => {
    if (weekDay !== undefined) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.me.schedule.byWeekDay(weekDay),
      });
    } else {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.me.schedule.all,
      });
    }
  };

  const refreshCurrentUserAppointments = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.users.me.appointments,
    });
  };

  const refreshAllUsers = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.users.all,
    });
  };

  return {
    refreshCurrentUser,
    refreshCurrentUserSchedule,
    refreshCurrentUserAppointments,
    refreshAllUsers,
  };
};
