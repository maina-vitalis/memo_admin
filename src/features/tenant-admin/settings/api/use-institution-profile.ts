"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchMyInstitution,
  updateMyInstitution,
  type UpdateInstitutionProfileInput,
} from "@/features/tenant-admin/settings/api/institution-profile";
import { updateInstitutionSummary } from "@/features/auth/store/auth-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAuthUser } from "@/features/auth/store/auth-selectors";

export const institutionProfileQueryKeys = {
  me: (institutionId: string) => ["settings", "institution", institutionId] as const,
};

export function useMyInstitution() {
  const institutionId = useAppSelector(
    (state) => state.auth.institutionId,
  );

  return useQuery({
    queryKey: institutionProfileQueryKeys.me(institutionId ?? ""),
    queryFn: () => fetchMyInstitution(institutionId as string),
    enabled: Boolean(institutionId),
  });
}

export function useUpdateMyInstitution() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const authUser = useAppSelector(selectAuthUser);

  return useMutation({
    mutationFn: (input: UpdateInstitutionProfileInput) => {
      if (!authUser.institutionId) {
        throw new Error("No institution associated with this account");
      }
      return updateMyInstitution(authUser.institutionId, input);
    },
    onSuccess: (institution) => {
      if (authUser.institutionId) {
        queryClient.setQueryData(
          institutionProfileQueryKeys.me(authUser.institutionId),
          institution,
        );
      }
      dispatch(updateInstitutionSummary({ name: institution.name }));
    },
  });
}
