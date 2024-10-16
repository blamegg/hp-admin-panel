import { SignInFormData } from "@/components/Signin/signIn";
import { apiClient, ApiEndpoints } from "@/utility/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";

interface AuthState {
  user: any | null;
  loginStatus: "idle" | "loading" | "success" | "failed";
  loginError: string | null;
  registerStatus: "idle" | "loading" | "success" | "failed";
  registerError: string | null;
}

export interface UserProps {
  name: string;
  email: string;
  password: string;
  mobile: string;
  status?: number;
}

const initialState: AuthState = {
  user: null,
  loginStatus: "idle",
  loginError: null,
  registerStatus: "idle",
  registerError: null,
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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginStatus = "loading";
        state.loginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loginStatus = "success";
        state.user = action.payload;
        localStorage.setItem("token", action.payload.token);
        toast.success("user logged successfully");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginStatus = "failed";
        state.loginError = action.payload as string;
        toast.error("failed to login");
      })
      .addCase(registerUser.pending, (state) => {
        state.registerStatus = "loading";
        state.registerError = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.registerStatus = "success";
        state.user = action.payload;
        toast.success("user register successfully");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerStatus = "failed";
        state.registerError = action.payload as string;
        toast.error("failed to register user");
      });
  },
});

export default authSlice.reducer;
