import { apiClient, ApiEndpoints } from "./api";

// fetch menu list
export const menuListFn = async () => {
  const response = await apiClient.get(ApiEndpoints.menus);
  return response.data.data;
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

// fetch roles
export const rolesFn = async (page: number, limit: number) => {
  const response = await apiClient.get(`${ApiEndpoints.roles}?page=${page}&limit=${limit}`);
  return response.data;
};

// fetch permissions
export const permissionsFn = async (page: number, limit: number) => {
  const response = await apiClient.get(`${ApiEndpoints.permissions}?page=${page}&limit=${limit}`);
  return response.data.data;
};

// create permission
export const createPermissionFn = async (payload: { name: string; menuId: string; subMenuId: string | null; isActive: boolean }) => {
  const response = await apiClient.post(ApiEndpoints.permissions, payload);
  return response.data;
};

// update permission
export const updatePermissionFn = async (payload: { name: string; menuId: string; subMenuId: string | null; isActive: boolean }, permissionId: string) => {
  const response = await apiClient.put(
    `${ApiEndpoints.permissions}/${permissionId}`,
    payload,
  );
  return response.data;
};

// delete permission
export const deletePermissionFn = async (permissionId: string) => {
  const response = await apiClient.delete(`${ApiEndpoints.permissions}/${permissionId}`);
  return response.data;
};

// create role
export const createRoleFn = async (payload: { name: string; permissions: { _id: string; name: string }[] }) => {
  const response = await apiClient.post(ApiEndpoints.roles, payload);
  return response.data;
};

// update role
export const updateRoleFn = async (payload: { name: string; permissions: { _id: string; name: string }[] }, roleId: string) => {
  const response = await apiClient.put(
    `${ApiEndpoints.roles}/${roleId}`,
    payload,
  );
  return response.data;
};

// delete role
export const deleteRoleFn = async (roleId: string) => {
  const response = await apiClient.delete(`${ApiEndpoints.roles}/${roleId}`);
  return response.data;
};
