import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserPermissions } from "@/redux/slice/authSlice";
import { RootState, AppDispatch } from "@/redux/store";

export const useUserPermissions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.authReducer.user);
  const premission = useSelector((state: RootState) => state.authReducer);
  const permissionsStatus = useSelector((state: RootState) => state.authReducer.permissionsStatus);


  useEffect(() => {
    if (user && user?.role && user?.role?._id && permissionsStatus === "idle") {
      dispatch(fetchUserPermissions(user?.role?._id));
    }
  }, [user, permissionsStatus, dispatch]);
}; 