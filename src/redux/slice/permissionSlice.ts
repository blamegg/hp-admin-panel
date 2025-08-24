import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { permissionsFn } from "@/utility/queryFetcher";

interface PermissionState {
  permissions: string[];
  permissionsStatus: "idle" | "loading" | "success" | "failed";
  permissionsError: string | null;
}

const initialState: PermissionState = {
  permissions: [],
  permissionsStatus: "idle",
  permissionsError: null,
};

export const fetchUserPermissions = createAsyncThunk(
  "permission/fetchUserPermissions",
  async (roleId: string, { rejectWithValue }) => {
    try {
      const response = await permissionsFn(roleId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch permissions");
    }
  },
);

const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    setPermissions: (state, action: PayloadAction<string[]>) => {
      state.permissions = action.payload;
    },
    clearPermissions: (state) => {
      state.permissions = [];
      state.permissionsStatus = "idle";
      state.permissionsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPermissions.pending, (state) => {
        state.permissionsStatus = "loading";
        state.permissionsError = null;
      })
      .addCase(fetchUserPermissions.fulfilled, (state, action) => {
        state.permissionsStatus = "success";
        let extractedPermissions: string[] = [];
        if (action.payload.data && Array.isArray(action.payload.data)) {
          extractedPermissions = [
            ...action.payload.data
              .filter((menu: any) => menu.assigned)
              .map((menu: any) => menu.name),
            ...action.payload.data
              .flatMap((menu: any) =>
                (menu.sub_menus || [])
                  .filter((sub: any) => sub.assigned)
                  .map((sub: any) => sub.name)
              ),
          ];
        }
        state.permissions = extractedPermissions;
      })
      .addCase(fetchUserPermissions.rejected, (state, action) => {
        state.permissionsStatus = "failed";
        state.permissionsError = action.payload as string;
      });
  },
});

export const { setPermissions, clearPermissions } = permissionSlice.actions;
export default permissionSlice.reducer; 