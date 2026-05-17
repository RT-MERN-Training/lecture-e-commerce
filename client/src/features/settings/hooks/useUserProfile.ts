import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { User } from '../../auth/types';
import { getUserById, updateUser } from '../userApi';
import type { UpdateUserPayload } from '../userApi';

const userProfileQueryKey = (userId: number) => ['user-profile', userId] as const;

export const useUserProfile = (userId: number) => {
  return useQuery({
    queryKey: userProfileQueryKey(userId),
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

export const useUpdateUserProfile = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserPayload) => updateUser(userId, data),
    onSuccess: (user: User) => {
      queryClient.setQueryData(userProfileQueryKey(userId), user);
      queryClient.invalidateQueries({ queryKey: userProfileQueryKey(userId) });
    },
  });
};
