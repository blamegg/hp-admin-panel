import { apiClient, ApiEndpoints } from "@/utility/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface AuthState {
  menu: any;
  menuListError: null | string;
  menuListStatus: "idle" | "loading" | "success" | "failed";
}

const initialState: AuthState = {
  menu: null,
  menuListError: null,
  menuListStatus: "idle",
};

export const getMenuList = createAsyncThunk(
  "menuList/menu",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(ApiEndpoints.menu);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "failed");
    }
  },
);

const menuListSlice = createSlice({
  name: "menuList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMenuList.pending, (state) => {
        state.menuListStatus = "loading";
        state.menuListError = null;
      })
      .addCase(getMenuList.fulfilled, (state, action) => {
        state.menuListStatus = "success";
        state.menu = action.payload?.data || [];
      })
      .addCase(getMenuList.rejected, (state, action) => {
        state.menuListStatus = "failed";
        state.menuListError = action.payload as string;
      });
  },
});

export default menuListSlice.reducer;
