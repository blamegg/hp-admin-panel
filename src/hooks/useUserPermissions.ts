import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserPermissions } from "@/redux/slice/authSlice";
import { RootState, AppDispatch } from "@/redux/store";

export const useUserPermissions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.authReducer.user);
  const permissionsStatus = useSelector((state: RootState) => state.authReducer.permissionsStatus);

  useEffect(() => {
  const cleanRoleId =
    typeof user?.role?._id === 'string' && user.role._id.startsWith('"')
      ? JSON.parse(user.role._id)
      : user?.role?._id;

  if (user && user?.role && cleanRoleId && permissionsStatus === "idle") {
    dispatch(fetchUserPermissions(cleanRoleId));
  }
}, [user, permissionsStatus, dispatch]);

};


// Reusable hook to get hasPermission function
export const useHasPermission = () => {
  const permissions = useSelector((state: RootState) => state?.authReducer?.permissions);
  // console.log(permissions)
  const hasPermission = (permissionKey: string): boolean => permissions.includes(permissionKey)

  return hasPermission;
}; 