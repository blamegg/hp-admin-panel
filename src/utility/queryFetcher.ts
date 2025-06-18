import { apiClient, ApiEndpoints } from "./api";

export interface CreatedBy {
  email: string,
  name: string,
  _id: string
}


export interface RolesInterFace {
  data: CurrentRoleDataInterFace[],
  message: string,
  pagination?: PaginationInterface,
  success: boolean
}


export interface RolesInterFace2 {
  message: string,
  success: boolean,
  name?: string,
  data?: menuDataInterface[]
}


export interface RoleDataInterFace2 {
  _id: string,
  __v: number,
  createdAt: string,
  updatedAt: string,
  updated_by: string,
  created_by: CreatedBy,
  deleted: boolean,
  name: string,
  status: boolean,
}

export interface CurrentRoleDataInterFace {
  _id: string,
  __v: number,
  createdAt: string,
  updatedAt: string,
  updated_by: string,
  created_by: CreatedBy,
  deleted: boolean,
  name: string,
  status: boolean,
  menus?: mainMenuInterface[],
  data?: RoleDataInterFace2
  rank: string;
}


export interface subMenuInterFace {
  sub_menu_id: string,
  name: string
}

export interface mainMenuInterface {
  menu_id: string,
  is_parent: string,
  name: string,
  sub_menus: subMenuInterFace[]
}

export interface ManusInterface {
  role_id: string,
  _id: string,
  __v: number,
  createdAt: string,
  updatedAt: string,
  updated_by: string,
  created_by: CreatedBy,
  deleted: boolean,
  name: string,
  status: boolean,
  menus: mainMenuInterface[]
}

export interface PaginationInterface {
  currentPage: number,
  hasNext: boolean,
  limit: number,
  total: number,
  totalPages: number

}

export interface menuDataInterface {
  menu_id: string,
  name: string,
  sub_menus: subMenuInterFace[],
  requiredPermissions?: string[];
}

export interface UpdatePermissionsInterFace {
  role_id: string;
  name: string;
  menus: {
    menu_id: string;
    name: string;
    order?: number;
    sub_menus: {
      sub_menu_id: string;
      name: string;
      order?: number;
    }[];
  }[];
}

// fetch menu list
export const menuListFn = async () => {

  const response = await apiClient.get(ApiEndpoints.menus);
  return response.data;
};
// fetch Dynamic menu list
export const dynamicMenuListFn = async () => {
  const response = await apiClient.get(ApiEndpoints.dynamicMenus);
  return response.data;
};


// fetch user list
export const usersFn = async (page: number = 1, limit: number = 10, search?: string, searchBasis?: string) => {
  let url = `${ApiEndpoints.users}?page=${page}&limit=${limit}`;
  
  if (search && search.trim()) {
    const searchField = searchBasis || 'name';
    url += `&${searchField}=${encodeURIComponent(search.trim())}`;
  }
  const response = await apiClient.get(url);
  return response.data;
};
  

// create user
export const createUserFn = async (payload: any) => {
  const response = await apiClient.post(ApiEndpoints.users, payload);
  return response.data;
};

// create Bulk user
export const createBulkUserFn = async (payload: FormData) => {
  const response = await apiClient.post(ApiEndpoints.bulkUsers, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
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

// create role
export const createRoleFn = async (payload: { name: string, rank: number }) => {
  const response = await apiClient.post(ApiEndpoints.roles, payload);
  return response.data;
};

// update role
export const updateRoleFn = async (payload: { name: string }, roleId: string) => {
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

// fetch permissions
export const permissionsFn = async (roleId: string) => {
  const response = await apiClient.get(`${ApiEndpoints.permissions}/get-menu-permission/${roleId}`);
  return response.data;
};

// update permission
export const updatePermissionFn = async (payload: UpdatePermissionsInterFace) => {
  const response = await apiClient.post(
    `${ApiEndpoints.permissions}/assign-menu-permission`,
    payload,
  );
  return response.data;
};

// update menu order
export const updateMenuOrderFn = async (payload: { orders: { id: string; order: number }[] }) => {
  const response = await apiClient.post(
    `${ApiEndpoints.menus}/update-order`,
    payload,
  );
  return response.data;
};

// change password
export const changePasswordFn = async (payload: { oldPassword: string; newPassword: string }) => {
  const response = await apiClient.post(`${ApiEndpoints.users}/change-password`, payload);
  return response.data;
};

// reset Password 
export const resetPasswordFn = async (id:string)=>{
  const response = await apiClient.post(`${ApiEndpoints.users}/reset-password/${id}`)
  return response.data;
}


