import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of the slice's state
interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string | null;
    name: string | null;
    email: string | null;
  };
}

// Define the initial state using that type
const initialState: AuthState = {
  isAuthenticated: false,
  user: {
    id: null,
    name: null,
    email: null,
  },
};

// Create the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{ id: string; name: string; email: string }>,
    ) {
      state.isAuthenticated = true;
      state.user = {
        id: action.payload.id,
        name: action.payload.name,
        email: action.payload.email,
      };
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = {
        id: null,
        name: null,
        email: null,
      };
    },
    updateUser(
      state,
      action: PayloadAction<{ name?: string; email?: string }>,
    ) {
      if (action.payload.name) {
        state.user.name = action.payload.name;
      }
      if (action.payload.email) {
        state.user.email = action.payload.email;
      }
    },
  },
});

// Export the actions
export const { login, logout, updateUser } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;
