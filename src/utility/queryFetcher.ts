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

export interface CreateLeaveTypesInterface{
  name: string;
  description?: string;
  half_day_allowed?:boolean;
  paid?:boolean;
}

export interface ApplyLeaveInterface {
  leave_type: string,
  leave_mode: string,
  dates?: string[],
  description?: string,
  start_date?: string | null,
  end_date?: string | null,
  half_day_session?: string | null
}



// fetch menu list
export const menuListFn = async () => {

  const response = await apiClient.get(ApiEndpoints.menus);
  return response.data;
};
// fetch Dynamic menu list
export const dynamicMenuListFn = async () => {
  const response = await apiClient.get(`${ApiEndpoints.menus}/role`);
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
  const response = await apiClient.post(`${ApiEndpoints.users}/bulk-import`, payload, {
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

// update role and Rank
export const updateRoleAndRankFn = async (payload: { name: string, rank:string }, roleId: string) => {
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
  console.log("roleId", roleId)
  const response = await apiClient.get(`${ApiEndpoints.permissions}/get-menu-permission/${roleId}`);
  return response.data;
};

// update permission
export const updatePermissionFn = async (payload: UpdatePermissionsInterFace) => {
  const response = await apiClient.post(
    `${ApiEndpoints.permissions}/assign-menu-permission`,
    payload,
  );
  console.log(response.data)
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

// Create leave Type
export const createLeaveTypeFn = async (payload: CreateLeaveTypesInterface)=>{
  const response = await apiClient.post(`${ApiEndpoints.leaveType}`, payload);
  return response.data;
}

// fetch leave Type
export const fetchLeaveTypesFn = async ()=>{
  const response = await apiClient.get(ApiEndpoints.leaveType);
  return response.data;
}

// delete leave
export const deleteLeaveTypesFn = async (leaveId: string) => {
  const response = await apiClient.delete(`${ApiEndpoints.leaveType}/${leaveId}`);
  return response.data;
};

// update leave
export const updateLeaveTypeFn = async (payload: any, leaveId: string) => {
  const response = await apiClient.put(`${ApiEndpoints.leaveType}/${leaveId}`, payload);
  return response.data;
};

// fetch taken leave list
export const fetchTakenLeaveListFn = async (params: { 
  status?: string;
  leave_type?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
} = {}) => {
  let url = `${ApiEndpoints.leaves}`;
  // Use URLSearchParams to easily construct the query string
  const queryParams = new URLSearchParams();

  // Iterate over the params object and append them to the query string if they have a value
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      queryParams.append(key, String(value));
    }
  });

  // If there are any query parameters, add them to the URL
  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`;
  }
  const response = await apiClient.get(url);
  console.log(response) 
  return response.data;
};

// apply leave
export const applyLeaveFn = async (payload: ApplyLeaveInterface) => {
  console.log(payload, "Payload");
  const response = await apiClient.post(`${ApiEndpoints.leaves}`, payload);
  return response.data;
}

// Approve or Reject leave application
export const approveRejectLeaveFn = async(leaveId:string, payload:{status:string, reason: string})=>{
  console.log(payload)
    const response = await apiClient.put(`${ApiEndpoints.leaves}/status/${leaveId}`, payload);
    return response.data;
}
// delete Leave Application
export const deleteLeaveFn = async(leaveId:string)=>{
    const response = await apiClient.delete(`${ApiEndpoints.leaves}/${leaveId}`);
    return response.data;
}