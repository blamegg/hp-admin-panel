import { apiClient, ApiEndpoints } from "./api";

// fetch menu list
export const menuListFn = async () => {
  const response = await apiClient.get(ApiEndpoints.menu);
  return response.data;
};

// fetch user list
export const usersFn = async () => {
  const response = await apiClient.get(ApiEndpoints.users);
  return response.data;
};

// create user
export const createUserFn = async (payload: any) => {
  const response = await apiClient.post(ApiEndpoints.users, payload);
  return response.data;
};

// delete user
export const deleteUserFn = async (id: string) => {
  const response = await apiClient.delete(`${ApiEndpoints.users}/id`);
  return response.data;
};
