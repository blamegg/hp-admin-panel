import { fetchLeaveTypeFn } from "@/utility/queryFetcher";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LeaveType {
  _id: string;
  name: string;
  description?: string;
  half_day_allowed: boolean;
  paid: boolean;
  deleted: boolean;
  created_by: string;
  updated_by: string;
  createdAt: string;
  updatedAt: string;
}

interface LeaveState {
  leaveTypes: LeaveType[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: LeaveState = {
  leaveTypes: [],
  total: 0,
  page: 1,
  totalPages: 1,
  limit: 10,
  loading: false,
  error: null,
};

// Async thunk to fetch leaves
export const fetchLeaveType = createAsyncThunk<
  {
    leaveTypes: LeaveType[];
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  },
  void,
  { rejectValue: string }
>(
  'leave/fetchLeave',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchLeaveTypeFn();
      // If response is an array, wrap it in the expected object
      if (Array.isArray(response)) {
        return {
          leaveTypes: response,
          total: response.length,
          page: 1,
          totalPages: 1,
          limit: 10,
        };
      }
      // If response is already an object with leaveTypes, return as is
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Something went wrong");
    }
  }
);

// Slice
const leaveSlice = createSlice({
  name: "leavesType",
  initialState,
  reducers: {
    setLeaves: (state, action: PayloadAction<{ leaveTypes: LeaveType[]; total: number; page: number; totalPages: number; limit: number }>) => {
      state.leaveTypes = action.payload.leaveTypes;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.totalPages = action.payload.totalPages;
      state.limit = action.payload.limit;
      state.loading = false;
      state.error = null;
    },
    setLeavesLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setLeavesError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaveType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveType.fulfilled, (state, action: PayloadAction<{ leaveTypes: LeaveType[]; total: number; page: number; totalPages: number; limit: number }>) => {
        state.leaveTypes = action.payload.leaveTypes;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.limit = action.payload.limit;
        state.loading = false;
      })
      .addCase(fetchLeaveType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch leave data";
      });
  }
});

// Export
export const { setLeaves, setLeavesLoading, setLeavesError } = leaveSlice.actions;
export default leaveSlice.reducer;
