import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { dynamicMenuListFn } from "@/utility/queryFetcher";

interface MenuListState {
  menuList: any[] | null;
  menuListError: null | string;
  menuListStatus: "idle" | "loading" | "success" | "failed";
  lastFetched: number | null;
}

const initialState: MenuListState = {
  menuList: null,
  menuListError: null,
  menuListStatus: "idle",
  lastFetched: null,
};

export const getMenuList = createAsyncThunk(
  "menuList/getMenuList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await dynamicMenuListFn();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch menu list");
    }
  }
);

const menuListSlice = createSlice({
  name: "menuList",
  initialState,
  reducers: {
    clearMenuList: (state) => {
      state.menuList = null;
      state.menuListError = null;
      state.menuListStatus = "idle";
      state.lastFetched = null;
    },
    setMenuListFromCache: (state, action: PayloadAction<any[]>) => {
      state.menuList = action.payload;
      state.menuListStatus = "success";
      state.lastFetched = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMenuList.pending, (state) => {
        state.menuListStatus = "loading";
        state.menuListError = null;
      })
      .addCase(getMenuList.fulfilled, (state, action) => {
        state.menuListStatus = "success";
        state.menuList = action.payload.data;
        state.lastFetched = Date.now();
      })
      .addCase(getMenuList.rejected, (state, action) => {
        state.menuListStatus = "failed";
        state.menuListError = action.payload as string;
      });
  },
});

export const { clearMenuList, setMenuListFromCache } = menuListSlice.actions;
export default menuListSlice.reducer;
