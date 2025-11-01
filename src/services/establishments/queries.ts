import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  type CreateEstablishmentInviteRequest,
  type GetAllEstablishmentParams,
  type UpdateInviteRequest,
} from "@/types";

import { establishmentService } from ".";
import { queryKeys } from "../queryClient";
import { TIMES } from "@/constants";

export const useGetEstablishments = (
  params?: GetAllEstablishmentParams,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: params
      ? queryKeys.establishments.list({ ...params })
      : queryKeys.establishments.all,
    queryFn: () => establishmentService.getAll(params),
    staleTime: TIMES.DEFAULT_STALE,
    enabled,
  });
};

export const useGetCurrentUserEstablishment = (enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.users.me.establishment,
    queryFn: () => establishmentService.getCurrentUserEstablishment(),
    staleTime: TIMES.DEFAULT_STALE,
    enabled,
  });
};

export const useGetEstablishmentByUUID = (
  { establishmentUUID }: { establishmentUUID: string },
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.establishments.detail(establishmentUUID),
    queryFn: () => establishmentService.getByUUID({ establishmentUUID }),
    staleTime: TIMES.DEFAULT_STALE,
    enabled: enabled && Boolean(establishmentUUID),
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
        queryKey: queryKeys.establishments.detail(data.uuid),
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
      establishmentUUID,
      formData,
    }: {
      establishmentUUID: string;
      formData: FormData;
    }) => establishmentService.update(establishmentUUID, formData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.establishments.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.establishments.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.establishments.detail(data.uuid),
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
    staleTime: TIMES.DEFAULT_STALE,
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
        queryKey: queryKeys.establishments.detail(data.establishmentUUID),
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
    mutationFn: (establishmentUUID: string) =>
      establishmentService.delete({ establishmentUUID }),
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
