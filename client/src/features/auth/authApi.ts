import axiosClient from "../../lib/axiosClient";
import type { User } from "./types";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>("/auth/login", {
    username: payload.username,
    password: payload.password,
    expiresInMins: 60,
  });
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await axiosClient.get<User>("/auth/me");
  return response.data;
};

export const refreshToken = async (token: string): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>("/auth/refresh", {
    refreshToken: token,
    expiresInMins: 60,
  });
  return response.data;
};
