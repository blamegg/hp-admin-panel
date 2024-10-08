import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import appReducer from "./slice/appSlice";
import messageReducer from "./slice/MessageSlice";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: {
    authReducer,
    app: appReducer,
    message: messageReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

// Export the store
export default store;
