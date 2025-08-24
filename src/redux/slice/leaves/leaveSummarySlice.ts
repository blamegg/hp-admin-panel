// leaveSummarySlice.ts
import { fetchLeavesSummaryFn } from "@/utility/queryFetcher";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

/** Types */
export interface LeaveTypeDetails {
  is_paid: boolean;
  is_monthly: boolean;
  total_allowed_leaves_days: number;
  total_applied_leaves: number;
  total_approved_leaves: number;
  total_pending_leaves: number;
  total_rejected_leaves: number;
  total_leaves_days_taken: number;
  remaining_days: number;
  unpaid_extra: number;
}

export interface YearlyLeaveSummary {
  year: number;
  total_allowed_leaves_days: number;
  total_leaves_days_taken: number;
  total_unpaid_leaves_days_taken: number;
  leave_types: Record<string, LeaveTypeDetails>;
}

export interface LeaveSummaryResponse {
  summary: YearlyLeaveSummary[];
}

interface LeaveSummaryState {
  summary: LeaveSummaryResponse | null;
  summaryLoading: boolean;
  summaryError: string | null;
}

const initialState: LeaveSummaryState = {
  summary: null,
  summaryLoading: false,
  summaryError: null,
};

/** Thunk */
export const fetchLeavesSummary = createAsyncThunk<
  LeaveSummaryResponse,
  void,
  { rejectValue: string }
>("leaveSummary/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchLeavesSummaryFn();
    return response;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || "Failed to fetch leave summary");
  }
});

/** Slice */
const leaveSummarySlice = createSlice({
  name: "leaveSummary",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeavesSummary.pending, (state) => {
        state.summaryLoading = true;
        state.summaryError = null;
      })
      .addCase(fetchLeavesSummary.fulfilled, (state, action) => {
        state.summary = action.payload;
        state.summaryLoading = false;
      })
      .addCase(fetchLeavesSummary.rejected, (state, action) => {
        state.summaryLoading = false;
        state.summaryError = action.payload || "Something went wrong";
      });
  },
});

export default leaveSummarySlice.reducer;
