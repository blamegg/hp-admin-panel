import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state type
interface AppState {
  color: string;
}

// Define the initial state
const initialState: AppState = {
  color: "#FF505D", // Initial color
};

// Create the app slice
const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // Reducer to change the color
    changeColor: (state, action: PayloadAction<string>) => {
      state.color = action.payload;
    },
  },
});

// Export the actions
export const { changeColor } = appSlice.actions;

// Export the reducer
export default appSlice.reducer;
