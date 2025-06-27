import { fetchLeaveModeListFn, fetchLeaveTypesListFn } from "@/utility/queryFetcher";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// ✅ Just a list of strings like: ["Full-Day", "Half-Day"]
export type LeaveMode = string;

interface LeaveModeListState {
  loading: boolean;
  error: string | null;
  LeaveModes: LeaveMode[];
}

// ✅ Initial state
const initialState: LeaveModeListState = {
  loading: false,
  error: null,
  LeaveModes: [],
};

// ✅ Async thunk to fetch leave modes (["Full-Day", "Half-Day", ...])
export const fetchLeaveModeList = createAsyncThunk<
  LeaveMode[],
  void,
  { rejectValue: string }
>("leave/fetchLeaveModes", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchLeaveModeListFn();
    return response.data || [];
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || "Something went wrong");
  }
});

const LeaveModeListSlice = createSlice({
  name: "LeaveModeList",
  initialState,
  reducers: {
    setLeaveModes: (state, action: PayloadAction<LeaveMode[]>) => {
      state.LeaveModes = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaveModeList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveModeList.fulfilled, (state, action: PayloadAction<LeaveMode[]>) => {
        state.loading = false;
        state.LeaveModes = action.payload;
      })
      .addCase(fetchLeaveModeList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch leave modes";
      });
  },
});

// ✅ Export
export const { setLeaveModes } = LeaveModeListSlice.actions;
export default LeaveModeListSlice.reducer;
