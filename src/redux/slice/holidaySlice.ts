import { fetchHolidayTypesFn, HolidayTypesInterface } from "@/utility/queryFetcher";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { rejects } from "assert";
import { createHolidayFn } from '@/utility/queryFetcher'; 

// Define the shape of a single holiday
export interface Holiday {
    _id: string;
    title: string;
    description?: string;
    dates: string[]; // Array of ISO date strings
    holiday_type: string;  // Holiday type ID
}

// Define the shape of the holiday state
interface HolidayState {
    holidays: Holiday[];
    loading: boolean;
    error: string | null;
}

// Initial state
const initialState: HolidayState = {
    holidays: [],
    loading: false,
    error: null,
};

export const fetchHolidayTypes = createAsyncThunk(
    "holidayTypes/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchHolidayTypesFn();
            return response; 
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to fetch Holiday Types"
            );
        }
    }
);

// Async Thunks
export const createHoliday = createAsyncThunk(
    'holidays/createHoliday',
    async (holidayData: Omit<Holiday, '_id'>, { rejectWithValue }) => {
        try {
            const response = await createHolidayFn(holidayData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

const holidaySlice = createSlice({
  name: "holidays",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHolidayTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHolidayTypes.fulfilled, (state, action: PayloadAction<HolidayTypesInterface[]>) => {
        state.loading = false;
        // Assuming you want to update holidayTypes in the state
        // You might want to create a separate slice for holidayTypes
      })
      .addCase(fetchHolidayTypes.rejected, (state, action) => {
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
        state.holidays.push(action.payload);
      })
      .addCase(createHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default holidaySlice.reducer;
