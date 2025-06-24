import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import authReducer from "./slice/authSlice";
import appReducer from "./slice/appSlice";
import messageReducer from "./slice/MessageSlice";
import menuReducer from "./slice/menuList";
import roleReducer from "./slice/roleSlice";
import leaveReducer from "./slice/leaveTypesSlice";
import takenLeaveReducer from './slice/takenLeaveSclice'

const authPersistConfig = {
  key: "auth",
  storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const store = configureStore({
  reducer: {
    authReducer: persistedAuthReducer,
    app: appReducer,
    message: messageReducer,
    menu: menuReducer,
    role: roleReducer,
    leaveTypes: leaveReducer,
    appliedLeaves: takenLeaveReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const persistor = persistStore(store);

export { store, persistor };
