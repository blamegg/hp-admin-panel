import { fetchHolidaysFn, fetchHolidayTypesFn, HolidayTypesInterface } from "@/utility/queryFetcher";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { rejects } from "assert";
import { createHolidayFn } from '@/utility/queryFetcher';
import { deleteHolidayFn } from '@/utility/queryFetcher';

// Define the shape of a single holiday
export interface HolidaysData {
    _id: string;
    title: string;
    description?: string;
    dates: string[]; 
    holiday_type: string;  
}

// Define the shape of the holiday state
interface HolidayState {
    holidays: HolidaysData[];
    loading: boolean;
    error: string | null;
}

// Initial state
const initialState: HolidayState = {
    holidays: [],
    loading: false,
    error: null,
};

export const fetchHolidays = createAsyncThunk(
    "holidayTypes/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchHolidaysFn();
            return response; 
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to fetch Holidays"
            );
        }
    }
);

// Async Thunks
export const createHoliday = createAsyncThunk(
    'holidays/createHoliday',
    async (holidayData: Omit<HolidaysData, '_id'>, { rejectWithValue }) => {
        try {
          console.log(holidayData)
            const response = await createHolidayFn(holidayData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteHoliday = createAsyncThunk(
    'holidays/deleteHoliday',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await deleteHolidayFn(id);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to delete holiday');
        }
    }
);

const holidaySlice = createSlice({
  name: "holidays",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHolidays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHolidays.fulfilled, (state, action: PayloadAction<HolidaysData[]>) => {
        state.holidays = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchHolidays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Holiday
      .addCase(createHoliday.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHoliday.fulfilled, (state, action) => {
        state.loading = false;
        state.holidays = action.payload;
      })
      .addCase(createHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Holiday
      .addCase(deleteHoliday.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHoliday.fulfilled, (state, action) => {
        state.loading = false;
        state.holidays = state.holidays;
      })
      .addCase(deleteHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default holidaySlice.reducer;
