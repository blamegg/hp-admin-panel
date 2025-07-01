import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CurrentRoleDataInterFace } from "@/utility/queryFetcher";
import { apiClient, ApiEndpoints } from "@/utility/api";

interface RoleState {
  selectedRole: CurrentRoleDataInterFace | null;
  allRoles: CurrentRoleDataInterFace[];
  totalDocuments: number;
}

const initialState: RoleState = {
  selectedRole: null,
  allRoles: [],
  totalDocuments: 0
};

interface FetchRolesArgs {
  page: number;
  limit: number;
  search?: string;
  basis?: string;
}

// fetch roles
export const rolesFn = async (page: number, limit: number, search?: string, basis?: string) => {
  let url = `${ApiEndpoints.roles}?page=${page}&limit=${limit}`;
  if (search && basis) {
    url += `&${basis}=${search}`;
  }
  const response = await apiClient.get(url);
  return response.data;
};

export const fetchRoleFn = createAsyncThunk(
  `${ApiEndpoints.roles}`,
  async ({ page, limit, search, basis }: FetchRolesArgs) => {
    let url = `${ApiEndpoints.roles}?page=${page}&limit=${limit}`;
    if (search && basis) {
        url += `&${basis}=${search}`;
    }
    const response = await apiClient.get(url);
    return response.data;
  },
);


const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setAllRoles: (state, action: PayloadAction<CurrentRoleDataInterFace[]>) => {
      state.allRoles = action.payload
    },
    clearAllRoles: (state) => {
      state.allRoles = []
    },
    setSelectedRole: (state, action: PayloadAction<CurrentRoleDataInterFace | null>) => {
      state.selectedRole = action.payload;
    },
    clearSelectedRole: (state) => {
      state.selectedRole = null;
    },

  },
  extraReducers: (builder) => {
    builder.addCase(fetchRoleFn.fulfilled, (state, action) => {
      state.allRoles = action.payload.data;
      state.totalDocuments = action.payload.pagination?.total || 0;
    });
  }
});

export const { setAllRoles, clearAllRoles, setSelectedRole, clearSelectedRole } = roleSlice.actions;
export default roleSlice.reducer; 