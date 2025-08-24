"use client";
import React, { useState } from 'react';
import { TextField, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { changePasswordFn, dynamicMenuListFn } from "@/utility/queryFetcher";
import Button from "@/components/common/Button";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { AppDispatch } from "@/redux/store";
import { updateUserTempPasswordStatus, fetchCurrentUser, setPermissions, clearAuthState } from "@/redux/slice/authSlice";
import { useQueryClient } from "@tanstack/react-query";
import { clearAllLocalData } from "@/utility/helper";
import { persistor } from "@/redux/store";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const ChangePassword = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Get user data and permissions from Redux
  const { user, permissions } = useSelector((state: RootState) => state.authReducer);

  // Check if user has CHANGE_PASSWORD permission
  const hasChangePasswordPermission = permissions.includes('Change Password');

  // Check if user has temporary password
  const isTempPassword = user?.isTempPassword;

  // Redirect if user doesn't have permission (only if not temp password)
  React.useEffect(() => {
    if (!isTempPassword && !hasChangePasswordPermission) {
      // toast.error("You don't have permission to change password");
      router.push("/dashboard");
    }
  }, [hasChangePasswordPermission, isTempPassword, router]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const handleToggleCurrentPassword = () => {
    setShowCurrentPassword((prev) => !prev);
  };

  const handleToggleNewPassword = () => {
    setShowNewPassword((prev) => !prev);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true);

    try {
      const response = await changePasswordFn({
        oldPassword: data.currentPassword,
        newPassword: data.newPassword
      });

      // Update user's temp password status in Redux immediately
      if (isTempPassword) {
        dispatch(updateUserTempPasswordStatus(false));
      }

      const successMessage = isTempPassword
        ? "Password changed successfully! You can now access all features."
        : response.message || "Password changed successfully!";

      toast.success(successMessage);
      reset();
      
      // For temporary password, just close the modal and let user continue
      // For regular password change, redirect to login
      if (isTempPassword) {
        // Close the modal and allow user to continue
        router.push("/dashboard");
      } else {
        // Immediately clear data and navigate to login page
        try {
          console.log("Starting cleanup process...");
          
          // Clear all local data (cookies, localStorage, sessionStorage)
          clearAllLocalData();
          console.log("Local data cleared");
          
          // Clear Redux persist storage
          await persistor.purge();
          console.log("Redux persist cleared");
          
          // Also manually clear persist keys from localStorage
          if (typeof window !== 'undefined') {
            const persistKeys = Object.keys(localStorage).filter(key => key.startsWith('persist:'));
            persistKeys.forEach(key => {
              localStorage.removeItem(key);
              console.log(`Manually removed persist key: ${key}`);
            });
          }
          
          // Clear auth state
          dispatch(clearAuthState());
          console.log("Auth state cleared");
          
          // Navigate to first login page
          router.push("/");
          
        } catch (error) {
          console.error("Error during cleanup:", error);
          // Still try to navigate even if cleanup fails
          router.push("/auth/signin");
        }
      }

    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to change password. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Change Password" />

      <div className="mx-auto max-w-2xl">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              {isTempPassword ? "Change Temporary Password" : "Change Password"}
            </h3>
            <p className="text-sm text-bodydark2 mt-1">
              {isTempPassword
                ? "You must change your temporary password before accessing other features."
                : "Enter your current password and choose a new password"
              }
            </p>
            {isTempPassword && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ You are using a temporary password. Please change it to continue using the application.
                </p>
              </div>
            )}
          </div>

          <div className="px-6.5 py-5">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-2.5">
                <TextField
                  label="Current Password"
                  type={showCurrentPassword ? "text" : "password"}
                  size="small"
                  placeholder="Enter your current password"
                  variant="outlined"
                  fullWidth
                  {...register("currentPassword")}
                  error={!!errors.currentPassword}
                  helperText={errors.currentPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={handleToggleCurrentPassword} edge="end">
                        {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
              </div>

              <div className="mb-2.5">
                <TextField
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  size="small"
                  placeholder="Enter your new password"
                  variant="outlined"
                  fullWidth
                  {...register("newPassword")}
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={handleToggleNewPassword} edge="end">
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
              </div>

              <div className="mb-4">
                <TextField
                  label="Confirm New Password"
                  type={showConfirmPassword ? "text" : "password"}
                  size="small"
                  placeholder="Confirm your new password"
                  variant="outlined"
                  fullWidth
                  {...register("confirmPassword")}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={handleToggleConfirmPassword} edge="end">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
              </div>

              <div className="mb-4.5">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-900/20 dark:border-blue-800">
                  <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Password Requirements:
                  </h4>
                  <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• Contains at least one uppercase letter</li>
                    <li>• Contains at least one lowercase letter</li>
                    <li>• Contains at least one number</li>
                  </ul>
                </div>
              </div>

              <div className={`flex md:w-[300px] gap-4`}>
                <Button
                  name={isLoading ? "Changing Password..." : (isTempPassword ? "Change Temporary Password" : "Change Password")}
                  type="submit"
                  loading={isLoading}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-medium bg-success `}
                />

                {!isTempPassword && (
                  <button
                    type="button"
                    onClick={() => reset()}
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-graydark text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ChangePassword;