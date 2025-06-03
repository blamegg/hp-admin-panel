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

// create role
export const createRoleFn = async (payload: any) => {
  const response = await apiClient.post(ApiEndpoints.roles, payload);
  return response.data;
};

// fetch permissions
export const fetchPermissionsFn = async () => {
  const response = await apiClient.get(ApiEndpoints.permissions);
  return response.data;
};

// fetch paginated roles
export const fetchPaginatedRolesFn = async (page: number, limit: number) => {
  const response = await apiClient.get(`${ApiEndpoints.roles}?page=${page}&limit=${limit}`);
  return response.data;
};

// update role
export const updateRoleFn = async (payload: any, roleId: string) => {
  const response = await apiClient.put(
    ApiEndpoints.updateRole(roleId),
    payload,
  );
  return response.data;
};

// delete role
export const deleteRoleFn = async (roleId: string) => {
  const response = await apiClient.delete(ApiEndpoints.deleteRole(roleId));
  return response.data;
};
