import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import {
  type Appointment,
  type CreateAppointmentByWorkerRequest,
  type CreateAppointmentRequest,
  type UpdateAppointmentRequest,
} from "@/types";

import { appointmentService } from ".";
import { queryKeys } from "../queryClient";
import { TIMES } from "@/constants";

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
    }: {
      workerUUID: string;
      data: CreateAppointmentRequest;
    }) => appointmentService.create(data),
    onSuccess: (
      data: Appointment,
      variables: { workerUUID: string; data: CreateAppointmentRequest }
    ) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.detail(data.uuid),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.availability(
          variables.workerUUID,
          data.scheduledAt.getDay(),
          data.scheduledAt.toISOString().split("T")[0]
        ),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.me.appointments,
      });
    },
  });
};

export const useCreateAppointmentByWorker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workerUUID,
      data,
    }: {
      workerUUID: string;
      data: CreateAppointmentByWorkerRequest;
    }) => appointmentService.createByWorker(workerUUID, data),
    onSuccess: (
      data: Appointment,
      variables: { workerUUID: string; data: CreateAppointmentByWorkerRequest }
    ) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.detail(data.uuid),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.availability(
          variables.workerUUID,
          data.scheduledAt.getDay(),
          data.scheduledAt.toISOString().split("T")[0]
        ),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.me.appointments,
      });
    },
  });
};

export const useGetCurrentUserAppointments = (enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.users.me.appointments,
    queryFn: () => appointmentService.getCurrentUserAppointments(),
    enabled,
    staleTime: TIMES.DEFAULT_STALE,
  });
};

export const useGetAppointment = (
  appointmentUUID: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.appointments.detail(appointmentUUID),
    queryFn: () => appointmentService.get(appointmentUUID),
    enabled: enabled && Boolean(appointmentUUID),
    staleTime: TIMES.DEFAULT_STALE,
    retry: (failureCount, error: AxiosError) => {
      if (error?.status === 404 || error?.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appointmentUUID,
      data,
    }: {
      appointmentUUID: string;
      workerUUID: string;
      data: UpdateAppointmentRequest;
    }) => appointmentService.update(appointmentUUID, data),
    onSuccess: (data, variables) => {
      const scheduledAt = new Date(data.scheduled_at);

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.availability(
          variables.workerUUID,
          scheduledAt.getDay(),
          scheduledAt.toISOString().split("T")[0]
        ),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.detail(data.uuid),
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });

      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.me.appointments,
      });
    },
  });
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentUUID: string) =>
      appointmentService.delete(appointmentUUID),
    onSuccess: (_, appointmentUUID) => {
      queryClient.removeQueries({
        queryKey: queryKeys.appointments.detail(appointmentUUID),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.me.appointments,
      });
    },
  });
};
