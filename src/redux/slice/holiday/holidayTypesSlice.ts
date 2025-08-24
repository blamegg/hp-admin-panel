import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchHolidayTypesFn,
  createHolidayTypeFn,
  updateHolidayTypeFn,
  deleteHolidayTypeFn,
} from "@/utility/queryFetcher";

export interface HolidayType {
  _id: string;
  name: string;
  description?: string;
  deleted: boolean;
  created_by: string;
  updated_by: string;
  createdAt: string;
  updatedAt: string;
}

interface HolidayTypeState {
  holidayTypes: HolidayType[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

const initialState: HolidayTypeState = {
  holidayTypes: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
};

// Async Thunks
export const fetchHolidayTypes = createAsyncThunk(
  "holidayTypes/fetchAll",
  async (
    { page = 1, limit = 10, search = '' }: { page?: number; limit?: number; search?: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await fetchHolidayTypesFn(page, limit, search);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch holiday types"
      );
    }
  }
);

export const createHolidayType = createAsyncThunk(
  "holidayTypes/create",
  async (
    holidayTypeData: Omit<HolidayType, "_id" | "createdAt" | "updatedAt" | "created_by" | "updated_by" | "deleted">,
    { dispatch, rejectWithValue }
  ) => {
    try {
      await createHolidayTypeFn(holidayTypeData);
      dispatch(fetchHolidayTypes({}));
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create holiday type"
      );
    }
  }
);

export const updateHolidayType = createAsyncThunk(
  "holidayTypes/update",
  async (
    { id, data }: { id: string, data: Partial<Omit<HolidayType, "_id">> },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await updateHolidayTypeFn(id, data);
      dispatch(fetchHolidayTypes({}));
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update holiday type"
      );
    }
  }
);

export const deleteHolidayType = createAsyncThunk(
  "holidayTypes/delete",
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      await deleteHolidayTypeFn(id);
      dispatch(fetchHolidayTypes({}));
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete holiday type"
      );
    }
  }
);

// Slice
const holidayTypesSlice = createSlice({
  name: "holidayTypes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchHolidayTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchHolidayTypes.fulfilled,
        (state, action: PayloadAction<any>) => {
          // Correctly extract the array from the `holidayTypes` property
          if (action.payload && Array.isArray(action.payload.holidayTypes)) {
            state.holidayTypes = action.payload.holidayTypes;
            state.total = action.payload.pagination.total;
            state.page = action.payload.pagination.page;
            state.limit = action.payload.pagination.limit;
          } else {
            // Fallback for any unexpected structure to prevent crashes
            state.holidayTypes = [];
            state.total = 0;
            state.page = 1;
          }
          
          state.loading = false;
        }
      )
      .addCase(fetchHolidayTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create, Update, Delete - Pending
      .addCase(createHolidayType.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateHolidayType.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteHolidayType.pending, (state) => {
        state.loading = true;
      })
      // Create, Update, Delete - Fulfilled (to reset loading state)
      .addCase(createHolidayType.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateHolidayType.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteHolidayType.fulfilled, (state) => {
        state.loading = false;
      })
      // Create, Update, Delete - Rejected
      .addCase(createHolidayType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateHolidayType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteHolidayType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default holidayTypesSlice.reducer; 