import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import {
  type CreateEstablishmentServiceRequest,
  type CreateWorkerEstablishmentServiceRequest,
  type UpdateEstablishmentServiceRequest,
} from "@/types";

import { serviceService } from ".";
import { queryKeys } from "../queryClient";

export const useGetAllCategories = () => {
  return useQuery({
    queryKey: queryKeys.services.all,
    queryFn: () => serviceService.getAllServicesCategories(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetServiceByID = (
  { serviceID }: { serviceID: number },
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.services.detail(serviceID),
    queryFn: () => serviceService.getServiceByID({ serviceID }),
    enabled: enabled && !!serviceID,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: AxiosError) => {
      if (error?.response?.status === 404) {
        return false;
      }

      return failureCount < 2;
    },
  });
};

export const useCreateEstablishmentService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEstablishmentServiceRequest) =>
      serviceService.createEstablishmentService(data),
    onSuccess: (variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.services.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.me.establishment,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.establishments.detail(variables.establishmentID),
      });
    },
  });
};

export const useCreateWorkerEstablishmentService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkerEstablishmentServiceRequest) =>
      serviceService.createWorkerEstablishmentService(data),
    onSuccess: (variables, data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.services.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.me.services,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.establishments.details(),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(data.workerUUID),
      });
    },
  });
};

export const useUpdateEstablishmentService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      serviceID,
      data,
    }: {
      serviceID: number;
      data: UpdateEstablishmentServiceRequest;
    }) => serviceService.updateService(serviceID, data),
    onSuccess: (variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.services.detail(variables.id),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.me.services,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.me.establishment,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.establishments.detail(variables.establishment_id),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.details(),
      });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ serviceID }: { serviceID: number }) =>
      serviceService.deleteService({ serviceID }),
    onSuccess: (variables) => {
      queryClient.cancelQueries({
        queryKey: queryKeys.services.detail(variables.id),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.me.establishment,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.establishments.detail(variables.establishment_id),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.details(),
      });
    },
  });
};

export const useRefreshServices = () => {
  const queryClient = useQueryClient();

  const refreshAllServices = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.services.all,
    });
  };

  const refreshUserServices = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.users.me.services,
    });
  };

  const refreshServiceDetail = (serviceID: number) => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.services.detail(serviceID),
    });
  };

  return {
    refreshAllServices,
    refreshUserServices,
    refreshServiceDetail,
  };
};
