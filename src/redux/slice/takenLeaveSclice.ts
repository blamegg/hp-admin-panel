import { fetchTakenLeaveListFn, fetchLeavesSummaryFn } from "@/utility/queryFetcher";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

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

interface TakenLeaveState {
  appliedLeaves: AppliedLeave[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  summary: any;
  summaryLoading: boolean;
  summaryError: string | null;
}

const initialState: TakenLeaveState = {
  appliedLeaves: [],
  pagination: null,
  loading: false,
  error: null,
  summary: null,
  summaryLoading: false,
  summaryError: null,
};

interface FetchLeaveParams {
  status?: string;
  leave_type?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}

// Async thunk to fetch applied leaves
export const fetchTakenLeaves = createAsyncThunk<
  AppliedLeavesResponse,
  FetchLeaveParams | void,
  { rejectValue: string }
>("appliedLeaves/fetch", async (params, { rejectWithValue }) => {
  try {
    const response = await fetchTakenLeaveListFn(params || {});
    return response;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || "Failed to fetch applied leaves");
  }
});

export const fetchLeavesSummary = () => async (dispatch: any) => {
  dispatch(setSummaryLoading(true));
  try {
    const data = await fetchLeavesSummaryFn();
    dispatch(setSummary(data));
    dispatch(setSummaryLoading(false));
  } catch (error: any) {
    dispatch(setSummaryError(error?.message || 'Failed to fetch summary'));
    dispatch(setSummaryLoading(false));
  }
};

const takenLeaveSlice = createSlice({
  name: "appliedLeaves",
  initialState,
  reducers: {
    setSummary(state, action) {
      state.summary = action.payload;
    },
    setSummaryLoading(state, action) {
      state.summaryLoading = action.payload;
    },
    setSummaryError(state, action) {
      state.summaryError = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTakenLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTakenLeaves.fulfilled, (state, action: PayloadAction<AppliedLeavesResponse>) => {
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

export const { setSummary, setSummaryLoading, setSummaryError } = takenLeaveSlice.actions;
export default takenLeaveSlice.reducer;



