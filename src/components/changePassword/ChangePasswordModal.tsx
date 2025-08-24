"use client";
import React, { useState } from 'react';
import { TextField, IconButton, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { changePasswordFn } from "@/utility/queryFetcher";
import Button from "@/components/common/Button";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { AppDispatch } from "@/redux/store";
import { updateUserTempPasswordStatus, clearAuthState } from "@/redux/slice/authSlice";
import { clearAllLocalData } from "@/utility/helper";

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

interface ChangePasswordModalProps {
  open: boolean;
  onClose?: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ open, onClose }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Get user data from Redux
  const { user } = useSelector((state: RootState) => state.authReducer);
  const isTempPassword = user?.isTempPassword || user?.user?.isTempPassword;

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
        if (onClose) {
          onClose();
        }
      } else {
        // Navigate to login page after successful password change
        setTimeout(() => {
          // Clear all local data (cookies, localStorage, sessionStorage)
          clearAllLocalData();
          
          // Clear auth state and redirect to login
          dispatch(clearAuthState());
          router.push("/auth/signin");
        }, 1000);
      }
      
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to change password. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't allow closing the modal if user has temporary password
  const handleClose = () => {
    if (!isTempPassword && onClose) {
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={isTempPassword}
      onBackdropClick={isTempPassword ? undefined : handleClose}
    >
      <DialogTitle className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20  border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isTempPassword ? "Change Temporary Password" : "Change Password"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {isTempPassword 
                ? "You must change your temporary password before accessing other features."
                : "Enter your current password and choose a new password"
              }
            </p>
          </div>
        </div>
        
        {isTempPassword && (
          <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ You are using a temporary password. Please change it to continue using the application.
            </p>
          </div>
        )}
      </DialogTitle>

      <DialogContent>
        <div className='py-4'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
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

            <div>
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

            <div>
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

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-2">
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

            <div className="flex gap-3 pt-2">
              <Button
                name={isLoading ? "Changing Password..." : (isTempPassword ? "Change Temporary Password" : "Change Password")}
                type="submit"
                loading={isLoading}
                className="flex-1 py-2.5 px-4 rounded-lg font-medium bg-success hover:bg-success/90"
              />
              
              {!isTempPassword && (
                <button
                  type="button"
                  onClick={() => reset()}
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-gray-500 text-white hover:bg-gray-600 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal; 