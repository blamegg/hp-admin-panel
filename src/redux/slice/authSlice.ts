import { SignInFormData } from "@/components/Signin/signIn";
import { apiClient, ApiEndpoints } from "@/utility/api";
import { setTokenCookie } from "@/utility/helper";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: any | null;
  loginStatus: "idle" | "loading" | "success" | "failed";
  loginError: string | null;
  registerStatus: "idle" | "loading" | "success" | "failed";
  registerError: string | null;
  permissions: string[];
}

export interface UserProps {
  name: string;
  email: string;
  password: string;
  mobile: string;
  status?: number;
  permissions?: string[];
}

const initialState: AuthState = {
  user: null,
  loginStatus: "idle",
  loginError: null,
  registerStatus: "idle",
  registerError: null,
  permissions: [],
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload: SignInFormData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(ApiEndpoints.login, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || "Login failed");
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload: UserProps, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(ApiEndpoints.register, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || "Register failed");
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(ApiEndpoints.logout);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || "Logout failed");
    }
  },
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${ApiEndpoints.users}/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching current user:", error);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user data");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setPermissions: (state, action: PayloadAction<string[]>) => {
      state.permissions = action.payload;
    },
    updateUserTempPasswordStatus: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        // Handle both possible user data structures
        if (state.user.user) {
          // If user data is nested under user.user
          state.user.user.isTempPassword = action.payload;
        } else {
          // If user data is directly in user
          state.user.isTempPassword = action.payload;
        }
      }
    },
    clearAuthState: (state) => {
      state.user = null;
      state.loginStatus = "idle";
      state.loginError = null;
      state.registerStatus = "idle";
      state.registerError = null;
      state.permissions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginStatus = "loading";
        state.loginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loginStatus = "success";
        state.user = action.payload.user;
        setTokenCookie(action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginStatus = "failed";
        state.loginError = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.registerStatus = "loading";
        state.registerError = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.registerStatus = "success";
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerStatus = "failed";
        state.registerError = action.payload as string;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loginStatus = "loading";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loginStatus = "idle";
        state.loginError = null;
        state.registerStatus = "idle";
        state.registerError = null;
        state.permissions = [];
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.user = null;
        state.loginStatus = "idle";
        state.loginError = null;
        state.registerStatus = "idle";
        state.registerError = null;
        state.permissions = [];
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loginStatus = "loading";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loginStatus = "success";
        console.log("Updating user state with:", action.payload);
        
        // Handle different response structures
        if (action.payload.user) {
          // If response has a user property
          state.user = action.payload.user;
        } else if (action.payload.data) {
          // If response has a data property
          state.user = action.payload.data;
        } else {
          // If response is the user object directly
          state.user = action.payload;
        }
        
        console.log("Updated user state:", state.user);
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loginStatus = "failed";
        state.loginError = action.payload as string;
      });
  },
});

export const { setPermissions, updateUserTempPasswordStatus, clearAuthState, setTestUserWithTempPassword } = authSlice.actions;
export default authSlice.reducer;
