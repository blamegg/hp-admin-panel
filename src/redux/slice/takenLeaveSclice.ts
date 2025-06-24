import { fetchTakenLeaveListFn } from "@/utility/queryFetcher";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppliedLeave {
  _id: string;
  leave_type: any;
  leave_mode: string;
  start_date: string;
  end_date?: string;
  description?: string;
  half_day_session?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}


interface AppliedLeaveState {
  appliedLeaves: AppliedLeave[];
  loading: boolean;
  error: string | null;
}

const initialState: AppliedLeaveState = {
  appliedLeaves: [],
  loading: false,
  error: null,
};

interface FetchLeaveParams {
  search?: string;
  search_by?: string;
}

// Async thunk to fetch applied leaves
export const fetchTakenLeaves = createAsyncThunk<
  AppliedLeave[],
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

const appliedLeaveSlice = createSlice({
  name: "appliedLeaves",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTakenLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTakenLeaves.fulfilled, (state, action: PayloadAction<AppliedLeave[]>) => {
        state.appliedLeaves = action.payload;
        state.loading = false;
      })
      .addCase(fetchTakenLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default appliedLeaveSlice.reducer;



