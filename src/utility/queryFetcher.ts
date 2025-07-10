import { AppliedLeave } from "@/redux/slice/leaves/leaveSclice";
import { apiClient, ApiEndpoints } from "./api";
import { useHasPermission } from "@/hooks/useUserPermissions";

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

export interface CreateLeaveTypesInterface {
  name: string;
  description?: string;
  half_day_allowed?: boolean;
  paid?: boolean;
  total_days_allowed?: number;
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

export interface HolidayTypesInterface {
  name: string,
  description?: string
}

export interface HolidaysInterface {
  _id: string;
  title: string;
  description?: string;
  dates: string[];
  holiday_type: string;
}


// -------------------------------------------------- Leaves ---------------------------------------------------- 

// fetch leave Type
export const fetchLeaveTypesFn = async () => {
  const response = await apiClient.get(ApiEndpoints.leaveType);
  return response.data;
}

// create a new leave Type
export const createLeaveTypesFn = async (payload: CreateLeaveTypesInterface) => {
  const response = await apiClient.post(ApiEndpoints.leaveType, payload);
  return response.data;
}

// update a leave Type
export const updateLeaveTypesFn = async (leaveId: string, payload: {
  name?: string;
  description?: string;
  half_day_allowed?: boolean;
  paid?: boolean;
}) => {
  console.log(payload, "api payload")
  const response = await apiClient.put(`${ApiEndpoints.leaveType}/${leaveId}`, payload);
  return response.data
}

// delete a leave Type
export const deleteLeaveTypeFn = async (leaveId: string) => {
  const response = await apiClient.delete(`${ApiEndpoints.leaveType}/${leaveId}`);
  return response.data;
}

// fetch leave types dropdown list only
export const fetchLeaveTypesListFn = async () => {
  const response = await apiClient.get(`${ApiEndpoints.leaveType}/leave-type-dropdown`);
  return response.data;
}

// fetch leave mode dropdown list only 
export const fetchLeaveModeListFn = async () => {
  const response = await apiClient.get(`${ApiEndpoints.leaves}/leave-modes`);
  return response.data;
}

// ---------------------------------- Menu----------------------------------------------------------
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

// -------------------------------User-----------------------------------------------------------------

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

// -------------------------------Roles----------------------------------------------------------
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
export const updateRoleAndRankFn = async (payload: { name: string, rank: string }, roleId: string) => {
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

// ---------------------------Permissions------------------------------------------------------

// fetch permissions
export const permissionsFn = async (roleId: string) => {
  const response = await apiClient.get(`${ApiEndpoints.permissions}/get-menu-permission/${roleId}`);
  return response.data;
};

// update permission permission
export const updatePermissionFn = async (payload: UpdatePermissionsInterFace) => {
  const response = await apiClient.post(
    `${ApiEndpoints.permissions}/assign-menu-permission`,
    payload,
  );
  return response.data;
};

// update permission menu order
export const updateMenuOrderFn = async (payload: { orders: { id: string; order: number }[] }) => {
  const response = await apiClient.post(
    `${ApiEndpoints.menus}/update-order`,
    payload,
  );
  return response.data;
};

// ----------------------Password-----------------------------------------------------------
// change password
export const changePasswordFn = async (payload: { oldPassword: string; newPassword: string }) => {
  const response = await apiClient.post(`${ApiEndpoints.users}/change-password`, payload);
  return response.data;
};

// reset Password 
export const resetPasswordFn = async (id: string) => {
  const response = await apiClient.post(`${ApiEndpoints.users}/reset-password/${id}`)
  return response.data;
}

// ---------------------------- LeaveType --------------------------------------------------------
// Create leave Type
export const createLeaveTypeFn = async (payload: CreateLeaveTypesInterface) => {
  const response = await apiClient.post(`${ApiEndpoints.leaveType}`, payload);
  return response.data;
}

// delete leave
export const deleteLeaveTypesFn = async (leaveId: string) => {
  const response = await apiClient.delete(`${ApiEndpoints.leaveType}/${leaveId}`);
  return response.data;
};

// update leave
export const updateLeaveTypeFn = async (payload: any, leaveId: string) => {
  console.log(payload, "payload")
  const response = await apiClient.put(`${ApiEndpoints.leaveType}/${leaveId}`, payload);
  return response.data;
};

// ---------------------------------- Leaves ------------------------------------------------------


// fetch taken leave list
export const fetchTakenLeaveListFn = async (
  params: {
    status?: string;
    leave_type?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    limit?: number;
  } = {},
  customUrl?: string
) => {
  let url = customUrl || `${ApiEndpoints.leaves}`;
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
  return response.data;
};

// apply leave
export const applyLeaveFn = async (payload: ApplyLeaveInterface) => {
  console.log(payload, "Payload");
  const response = await apiClient.post(`${ApiEndpoints.leaves}`, payload);
  return response.data;
}

// Approve or Reject leave application
export const approveRejectLeaveFn = async (leaveId: string, payload: { status: string, reason: string }) => {
  const response = await apiClient.put(`${ApiEndpoints.leaves}/status/${leaveId}`, payload);
  return response.data;
}

// delete Leave Application
export const updateAppliedLeaveFn = async (leaveId: string, payload: any) => {
  const response = await apiClient.put(`${ApiEndpoints.leaves}/${leaveId}`, payload);
  return response.data;
}

// delete Leave Application
export const deleteLeaveFn = async (leaveId: string) => {
  const response = await apiClient.delete(`${ApiEndpoints.leaves}/${leaveId}`);
  return response.data;
}

// fetch leaves summary
export const fetchLeavesSummaryFn = async () => {
  const response = await apiClient.get(`${ApiEndpoints.leaves}/summary`);
  return response.data;
}


// --------------------------------------------- Holidays -----------------------------------------
// create holiday
export const createHolidayFn = async (payload: any) => {
  const response = await apiClient.post(ApiEndpoints.holidays, payload);
  return response.data;
};

// fetch all holidays
export const fetchHolidaysFn = async () => {
  const response = await apiClient.get(ApiEndpoints.holidays);
  return response.data;
};

// fetch holiday by id
export const getHolidayByIdFn = async (id: string) => {
  const response = await apiClient.get(`${ApiEndpoints.holidays}/${id}`);
  return response.data;
};

// fetch holiday by id
export const updateHolidayFn = async (payload: HolidaysInterface) => {
  const response = await apiClient.put(`${ApiEndpoints.holidays}/${payload._id}`, payload);
  return response.data;
};

// delete holiday
export const deleteHolidayFn = async (holidayId: string) => {
  const response = await apiClient.delete(`${ApiEndpoints.holidays}/${holidayId}`);
  return response.data;
};

// -------------------------------------------------- Holiday Types ---------------------------------------------------- 

// // create holiday types 
// export const createHolidayTypesFn = async (payload:HolidayTypesInterface)=>{
//   const response = await apiClient.post(ApiEndpoints.holidayTypes, payload);
//   return response.data
// }

// create a new Holiday Types
export const createHolidayTypeFn = async (payload: { name: string; description?: string }) => {
  console.log(payload, "Apicall")
  const response = await apiClient.post(ApiEndpoints.holidayTypes, payload);
  return response.data;
};

// fetch all Holiday Types
export const fetchHolidayTypesFn = async (page: number = 1, limit: number = 10, search?: string) => {
  let url = `${ApiEndpoints.holidayTypes}?page=${page}&limit=${limit}`;
  if (search && search.trim()) {
    url += `&name=${encodeURIComponent(search.trim())}`;
  }
  const response = await apiClient.get(url);
  return response.data;
};

// fetch all Holiday Types List
export const fetchHolidayTypesListFn = async () => {
  const response = await apiClient.get(`${ApiEndpoints.holidayTypes}/holiday-type-dropdown`);
  return response.data;
};

// update a Holiday Type
export const updateHolidayTypeFn = async (id: string, payload: { name?: string; description?: string }) => {
  const response = await apiClient.put(`${ApiEndpoints.holidayTypes}/${id}`, payload);
  return response.data;
};

// delete a Holiday Type
export const deleteHolidayTypeFn = async (id: string) => {
  const response = await apiClient.delete(`${ApiEndpoints.holidayTypes}/${id}`);
  return response.data;
};

// ----------------------------------Blogs--------------------------------------
// Blog API functions
export const fetchBlogsFn = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  title?: string;
  author?: string;
  status?: string;
  categories?: string[];
  tags?: string[];
} = {}) => {
  let url = `${ApiEndpoints.blogs}`;
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length > 0) {
        queryParams.append(key, value.join(','));
      }
    } else if (value) {
      queryParams.append(key, String(value));
    }
  });

  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`;
  }

  const response = await apiClient.get(url);
  return response.data;
};

// This api will be used for create, update, and auto save
export const createBlogFn = async (payload: any) => {
  console.log('[createBlogFn] Payload being sent:', payload);
  const response = await apiClient.post(ApiEndpoints.blogs, payload);
  return response.data;
};

// this api will be used only for publish blog
export const updateBlogFn = async (id: string, payload: any) => {
  console.log('[updateBlogFn] Payload being sent:', payload);
  const response = await apiClient.put(`${ApiEndpoints.blogs}/${id}`, payload);
  return response.data;
};

export const fetchBlogByIdFn = async (id: string) => {
  const response = await apiClient.get(`${ApiEndpoints.blogs}/${id}`);
  return response.data;
};
// Delete one blog
export const deleteBlogFn = async (id: string) => {
  const response = await apiClient.delete(`${ApiEndpoints.blogs}/${id}`);
  return response.data;
};

// Bulk delete blogs by IDs
export const deleteBlogsBulkFn = async (ids: string[]) => {
  const response = await apiClient.delete(`${ApiEndpoints.blogs}`, { data: { ids } });
  return response.data;
};

// Delete blogs by status (e.g., draft, published)
export const deleteBlogsByStatusFn = async (status: string) => {
  const response = await apiClient.delete(`${ApiEndpoints.blogs}/delete-all`, { params: { status } });
  return response.data;
};

// --------------------------------- Blog Comments ------------------------------------------------

// fetch blog comments

export const fetchBlogCommentsFn = async (id: string, status?: string) => {
  let url = `${ApiEndpoints.blogs}/${id}/comments`;
  if (status && status !== '') {
    url += `?status=${encodeURIComponent(status)}`;
  }
  const response = await apiClient.get(url);
  return response.data;
};

// Update a blog comment
export const updateBlogCommentFn = async (blogId: string, commentId: string, content: string) => {
  const response = await apiClient.put(`${ApiEndpoints.blogs}/comments/${commentId}`, { content });
  return response.data;
};

// Delete a blog comment
export const deleteBlogCommentFn = async (blogId: string, commentId: string) => {
  const response = await apiClient.delete(`${ApiEndpoints.blogs}/comments/${commentId}`);
  return response.data;
};

// Add a reply to a blog comment
export const addBlogCommentReplyFn = async (blogId: string, commentId: string, content: string) => {
  console.log("blogId", blogId)
  console.log("comment id", commentId)
  console.log("content", content)
  const response = await apiClient.post(`${ApiEndpoints.blogs}/${blogId}/comments/${commentId}/reply`, { content });
  return response.data;
};

// Like a blog comment
export const likeBlogCommentFn = async (blogId: string, commentId: string) => {
  const response = await apiClient.post(`${ApiEndpoints.blogs}/comments/${commentId}/like`);
  return response.data;
};

// ? Dislike a blog comment
export const dislikeBlogCommentFn = async (blogId: string, commentId: string) => {
  const response = await apiClient.post(`${ApiEndpoints.blogs}/${blogId}/comments/${commentId}/dislike`);
  return response.data;
};

export const approveBlogCommentFn = async (blogId: string, commentId: string) => {
  const response = await apiClient.put(`${ApiEndpoints.blogs}/comments/${commentId}/status`,{status:"Approved"});
  return response.data;
};

export const rejectBlogCommentFn = async (blogId: string, commentId: string) => {
  const response = await apiClient.put(`${ApiEndpoints.blogs}/comments/${commentId}/status`,{status:"Rejected"});
  return response.data;
};



