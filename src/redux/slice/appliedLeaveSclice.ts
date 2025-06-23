import { fetchAppliedLeaveFn } from "@/utility/queryFetcher";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppliedLeaveState {
//   appliedLeaves: AppliedLeave[];
  loading: boolean;
  error: string | null;
}

const initialState: AppliedLeaveState = {
//   appliedLeaves: [],
  loading: false,
  error: null,
};

// Async thunk to fetch applied leaves
export const fetchAppliedLeaves = createAsyncThunk<
//   AppliedLeave[],
  void,
  { rejectValue: string }
>("appliedLeaves/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await fetchAppliedLeaveFn();
    return res;
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
      .addCase(fetchAppliedLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppliedLeaves.fulfilled, (state, action: PayloadAction) => {
        // state.appliedLeaves = action.payload;
        state.loading = false;
      })
      .addCase(fetchAppliedLeaves.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload || "Something went wrong";
      });
  },
});

export default appliedLeaveSlice.reducer;
