import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import authReducer from "./slice/authSlice";
import appReducer from "./slice/appSlice";
import messageReducer from "./slice/MessageSlice";
import menuReducer from "./slice/menuList";
import roleReducer from "./slice/roleSlice";
import leavesReducer from './slice/leaves/leaveSclice';
import leaveTypesReducer from "./slice/leaves/leaveTypesSlice";
import leaveTypesListReducer from "./slice/leaves/leaveTypesListSlice";
import leaveSummaryReducer from "./slice/leaves/leaveSummarySlice";
import leaveModes from './slice/leaves/leaveModeListSlice';
import holidayTypesReducer from "./slice/holiday/holidayTypesSlice";
import holidayTypesListReducer from './slice/holiday/holidayTypesListSlice';
import leaveModeListReducer from "./slice/leaves/leaveModeListSlice";
import holidayReducer from "./slice/holiday/holidaySlice";
import permissionReducer from './slice/permissionSlice';
import blogReducer from './slice/blog/blogSlice';
import blogCommentsReducer from './slice/blog/blogCommentsSlice';


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
    blogComments: blogCommentsReducer,
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
