import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  type CreateEstablishmentInviteRequest,
  type GetAllEstablishmentParams,
  type UpdateInviteRequest,
} from "@/types";

import { establishmentService } from ".";
import { queryKeys } from "../queryClient";

export const useGetEstablishments = (
  params?: GetAllEstablishmentParams,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: params
      ? queryKeys.establishments.list({ ...params })
      : queryKeys.establishments.all,
    queryFn: () => establishmentService.getAll(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled,
  });
};

export const useGetCurrentUserEstablishment = (enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.users.me.establishment,
    queryFn: () => establishmentService.getCurrentUserEstablishment(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled,
  });
};

export const useGetEstablishmentByID = (
  { establishmentID }: { establishmentID: number },
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.establishments.detail(establishmentID),
    queryFn: () => establishmentService.getByID({ establishmentID }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: enabled && Boolean(establishmentID),
  });
};

export const useCreateEstablishment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => establishmentService.create(formData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.establishments.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.establishments.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.establishments.detail(data.id),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.me.establishment,
      });
    },
  });
};

export const useUpdateEstablishment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      establishmentID,
      formData,
    }: {
      establishmentID: number;
      formData: FormData;
    }) => establishmentService.update(establishmentID, formData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.establishments.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.establishments.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.establishments.detail(data.id),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.me.establishment,
      });
    },
  });
};

export const useCreateEstablishmentInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEstablishmentInviteRequest) =>
      establishmentService.createEstablishmentInvite(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.establishments.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.establishments.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.me.invites,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.me.establishment,
      });
    },
  });
};

export const useGetCurrentUserInvites = (enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.users.me.invites,
    queryFn: () => establishmentService.getCurrentUserInvites(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled,
  });
};

export const useUpdateInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateInviteRequest) =>
      establishmentService.updateInvite(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.me.invites,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.establishments.detail(data.establishmentID),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(data.inviteeUUID),
      });
    },
  });
};

export const useDeleteEstablishment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (establishmentID: number) =>
      establishmentService.delete({ establishmentID }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.establishments.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.establishments.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.users.me.establishment,
      });
    },
  });
};
