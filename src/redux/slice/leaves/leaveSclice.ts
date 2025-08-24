// takenLeaveSlice.ts
import { fetchTakenLeaveListFn } from "@/utility/queryFetcher";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

/** Types */
export interface AppliedLeave {
  _id: string;
  leave_type: any;
  leave_mode: string;
  start_date?: string | null;
  end_date?: string | null;
  dates?: string[];
  description?: string;
  half_day?: boolean;
  half_day_session?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  created_by: string;
  updated_by: string;
  deleted: boolean;
  user_details: {
    name: string;
    _id: string;
  };
  days_count: number;
  reason?: string;
}

export interface Pagination {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNext: boolean;
}

export interface AppliedLeavesResponse {
  success: boolean;
  message: string;
  pagination: Pagination;
  leaves: AppliedLeave[];
}

export interface FetchLeaveParams {
  status?: string;
  leave_type?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
  customUrl?: string;
}

interface TakenLeaveState {
  appliedLeaves: AppliedLeave[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}

const initialState: TakenLeaveState = {
  appliedLeaves: [],
  pagination: null,
  loading: false,
  error: null,
};

/** Thunks */
export const fetchTakenLeaves = createAsyncThunk<
  AppliedLeavesResponse,
  FetchLeaveParams | void,
  { rejectValue: string }
>("appliedLeaves/fetchTaken", async (params, { rejectWithValue }) => {
  try {
    const response = await fetchTakenLeaveListFn(params || {}, params?.customUrl);
    return response;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || "Failed to fetch applied leaves");
  }
});

/** Slice */
const takenLeaveSlice = createSlice({
  name: "appliedLeaves",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTakenLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTakenLeaves.fulfilled, (state, action) => {
        state.appliedLeaves = action.payload.leaves;
        state.pagination = action.payload.pagination;
        state.loading = false;
      })
      .addCase(fetchTakenLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default takenLeaveSlice.reducer;
