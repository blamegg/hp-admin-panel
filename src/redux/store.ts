import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import authReducer from "./slice/authSlice";
import appReducer from "./slice/appSlice";
import messageReducer from "./slice/MessageSlice";
import menuReducer from "./slice/menuList";
import roleReducer from "./slice/roleSlice";
import leavesReducer from './slice/leaveSclice';
import leaveTypesReducer from "./slice/leaveTypesSlice";
import leaveTypesListReducer from "./slice/leaveTypesListSlice";
import leaveSummaryReducer from "./slice/leaveSummarySlice";
import leaveModes from './slice/leaveModeListSlice';
import holidayTypesReducer from "./slice/holidayTypesSlice";
import holidayTypesListReducer from './slice/holidayTypesListSlice';
import leaveModeListReducer from "./slice/leaveModeListSlice";
import holidayReducer from "./slice/holidaySlice";
import permissionReducer from './slice/permissionSlice';
import blogReducer from './slice/blogSlice';


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
    appliedLeaves: leavesReducer,
    leaveModes: leaveModes,
    leaveTypes: leaveTypesReducer,
    leaveTypesList: leaveTypesListReducer,
    leaveSummaryReducer: leaveSummaryReducer,
    holidayTypes: holidayTypesReducer,
    holidayTypesList: holidayTypesListReducer,
    leaveModeList: leaveModeListReducer,
    holidays: holidayReducer,
    permission: permissionReducer,
    blogs: blogReducer,
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
