"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchMyProfile,
  updateMyProfile,
  type UpdateMyProfileInput,
} from "@/features/super-admin/settings/api/profile";
import { updateProfileFields } from "@/features/auth/store/auth-slice";
import { useAppDispatch } from "@/store/hooks";

export const profileQueryKeys = {
  me: ["settings", "profile"] as const,
};

export function useMyProfile() {
  return useQuery({
    queryKey: profileQueryKeys.me,
    queryFn: fetchMyProfile,
  });
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (input: UpdateMyProfileInput) => updateMyProfile(input),
    onSuccess: (user) => {
      queryClient.setQueryData(profileQueryKeys.me, user);
      dispatch(
        updateProfileFields({
          firstName: user.firstName,
          lastName: user.lastName,
        }),
      );
    },
  });
}
