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

// view user
export const viewUserFn = async (userId: string) => {
  const response = await apiClient.get(`${ApiEndpoints.users}/${userId}`);
  return response.data;
};

// update user
export const updateUserFn = async (payload: any, userId: string) => {
  const response = await apiClient.put(
    `${ApiEndpoints.users}/${userId}`,
    payload,
  );
  return response.data;
};

// delete user
export const deleteUserFn = async (userId: string) => {
  const response = await apiClient.delete(`${ApiEndpoints.users}/${userId}`);
  return response.data;
};
