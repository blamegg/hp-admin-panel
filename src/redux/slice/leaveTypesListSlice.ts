import { fetchLeaveTypesListFn } from "@/utility/queryFetcher";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LeaveTypesListData {
  _id: string;
  name: string;
  success:boolean;
  message:string;
}

interface LeaveTypesListState {
  loading: boolean;
  error: string | null;
  LeaveTypesList: LeaveTypesListData[];
}

// Initial state
const initialState: LeaveTypesListState = {
  loading: false,
  error: null,
  LeaveTypesList: [],
};

// ✅ Async thunk to fetch leave types list
export const fetchLeaveTypesList = createAsyncThunk<
  LeaveTypesListData[], 
  void,
  { rejectValue: string }
>("leave/fetchLeaveTypesList", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchLeaveTypesListFn();
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || "Something went wrong");
  }
});

const LeaveTypesListSlice = createSlice({
  name: "LeaveTypesList",
  initialState,
  reducers: {
    setLeaveTypesList: (state, action: PayloadAction<LeaveTypesListData[]>) => {
      state.LeaveTypesList = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaveTypesList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveTypesList.fulfilled, (state, action: PayloadAction<LeaveTypesListData[]>) => {
        state.loading = false;
        state.LeaveTypesList = action.payload;
      })
      .addCase(fetchLeaveTypesList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch leave types";
      });
  },
});

// Export
export const { setLeaveTypesList } = LeaveTypesListSlice.actions;
export default LeaveTypesListSlice.reducer;
