import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: {
    authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

// Export the store
export default store;
