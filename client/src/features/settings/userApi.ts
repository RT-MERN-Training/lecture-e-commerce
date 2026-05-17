import axiosClient from '../../lib/axiosClient';
import type { User } from '../auth/types';

export interface UpdateUserPayload {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export const getUserById = async (id: number): Promise<User> => {
  const response = await axiosClient.get<User>(`/users/${id}`);
  return response.data;
};

export const updateUser = async (id: number, payload: UpdateUserPayload): Promise<User> => {
  const response = await axiosClient.put<User>(`/users/${id}`, payload);
  return response.data;
};
