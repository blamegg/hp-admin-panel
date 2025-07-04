import { fetchHolidayTypesListFn } from "@/utility/queryFetcher";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface HolidayTypesListData {
  _id: string;
  name: string;
}

export interface HolidayTypesListResponse {
    data: HolidayTypesListData[];
    success?: boolean;
    message?: string;
}

interface HolidayTypesListState {
  loading: boolean;
  error: string | null;
  holidayTypesList: HolidayTypesListResponse | null;
}

// Initial state
const initialState: HolidayTypesListState = {
  loading: false,
  error: null,
  holidayTypesList: null,
};

// ✅ Exported thunk
export const fetchHolidayTypesList = createAsyncThunk<
  HolidayTypesListResponse,
  void,
  { rejectValue: string }
>(
  "holidayTypesList/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchHolidayTypesListFn();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch Holiday Types list"
      );
    }
  }
);

export const holidayTypesListSlice = createSlice({
  name: "holidayTypesList",
  initialState,
  reducers: {
    setHolidayTypesList: (
      state,
      action: PayloadAction<HolidayTypesListResponse>
    ) => {
      state.holidayTypesList = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHolidayTypesList.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(
        fetchHolidayTypesList.fulfilled,
        (state, action: PayloadAction<HolidayTypesListResponse>) => {
          state.holidayTypesList = action.payload;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(
        fetchHolidayTypesList.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error =
            action.payload || "Failed to fetch Holiday Types list";
        }
      );
  },
});

// ✅ Export actions and reducer
export const { setHolidayTypesList } = holidayTypesListSlice.actions;
export default holidayTypesListSlice.reducer;
