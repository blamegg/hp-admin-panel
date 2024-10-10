import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import appReducer from "./slice/appSlice";
import messageReducer from "./slice/MessageSlice";
import calendarReducer from "./slice/calendarSlice";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: {
    authReducer,
    app: appReducer,
    message: messageReducer,
    calendar: calendarReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
