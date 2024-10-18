"use client";
import { logo, signingBg } from "@/assets";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { TextField, FormControlLabel, Switch, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/redux/slice/authSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { toast } from "sonner";
import Button from "../common/Button";
import { useMutation } from "@tanstack/react-query";

const schema = z.object({
  email: z
    .string()
    .nonempty("Email is required.")
    .email("Please enter a valid email address."),
  password: z
    .string()
    .nonempty("Password is required.")
    .min(8, "Password must be at least 8 characters long."),
});
export interface SignInFormData {
  email: string;
  password: string;
}

export const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(schema),
  });
  const dispatch = useDispatch<AppDispatch>();

  const { loginStatus, user } = useSelector(
    (state: RootState) => state.authReducer,
  );

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [router, user]);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRememberMeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRememberMe(event.target.checked);
  };

  const onSubmit = async (data: SignInFormData) => {
    let toastMessage = "";

    try {
      const result = await dispatch(loginUser(data)).unwrap();
      toastMessage = result.message || "Login successful!";
      if (typeof toastMessage !== "string") {
        toastMessage = "unknown error";
      }
      toast.success(toastMessage);
      router.push("/dashboard");
      reset();
    } catch (error: any) {
      toastMessage = error || "Login failed. Please try again.";
      if (typeof toastMessage !== "string") {
        toastMessage = "unknown error";
      }
      toast.error(toastMessage);
    }
  };

  return (
    <div
      className="relative flex h-[100vh] flex-col items-center justify-center pb-0 pt-8"
      style={{
        backgroundImage: `url(${signingBg.src})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 flex flex-col items-center justify-center rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:w-[25%]">
        <div className="w-full px-4 pb-2 pt-4">
          <div className="absolute top-[-59px] w-[90%] rounded-xl bg-[#1976D2] py-3">
            <div className="grid place-items-center">
              <Image src={logo.src} alt="company" width={40} height={40} />
            </div>
            <h2 className="mt-1 text-center text-[18px] font-semibold text-white dark:text-black">
              Hanging Panda
            </h2>
            <h2 className="mt-1 text-center text-[18px] font-semibold text-white dark:text-black">
              Sign In
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-20">
            <div className="mb-4">
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    label="Email"
                    type="email"
                    size="small"
                    placeholder="Enter your email"
                    variant="outlined"
                    fullWidth
                    {...field}
                    error={!!errors.email}
                    helperText={errors.email ? errors.email.message : ""}
                    InputProps={{
                      classes: {
                        root: "bg-transparent border-stroke dark:border-form-strokedark dark:bg-form-input dark:text-white",
                        focused: "border-primary",
                      },
                    }}
                    InputLabelProps={{
                      className: "font-medium text-black dark:text-white",
                    }}
                  />
                )}
              />
            </div>
            <div className="relative mb-6">
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    size="small"
                    placeholder="8+ Characters"
                    variant="outlined"
                    fullWidth
                    {...field}
                    error={!!errors.password}
                    helperText={errors.password ? errors.password.message : ""}
                    InputProps={{
                      classes: {
                        root: "bg-transparent border-stroke dark:border-form-strokedark dark:bg-form-input dark:text-white",
                        focused: "border-primary",
                      },
                      endAdornment: (
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                    InputLabelProps={{
                      className: "font-medium text-black dark:text-white",
                    }}
                  />
                )}
              />
            </div>
            <div className="title-sm flex flex-row items-center justify-between pb-3 pt-0">
              <FormControlLabel
                control={
                  <Switch
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                    color="primary"
                  />
                }
                label="Remember Me"
              />
              <div>
                <Link
                  href="/forgotPassword"
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Forgot Password
                </Link>
              </div>
            </div>

            <div className="mb-5">
              <h5 className="text-gray-600 mb-3 text-sm font-semibold">
                Don&apos;t have an account?{" "}
                <Link
                  className="font-semibold text-primary hover:underline"
                  href="/register"
                >
                  Sign up
                </Link>
              </h5>
              <Button
                name="Sign In"
                type="submit"
                loading={loginStatus === "loading" && true}
                className="h-[35px] w-full py-1.5 text-[16px] font-medium"
              />
            </div>
          </form>
        </div>
      </div>

      <p className="absolute bottom-2 left-0 z-10 w-full text-center text-[14px] font-semibold text-white">
        ©️ 2024, made by Hanging Panda for a better web
      </p>
    </div>
  );
};

export default Signin;
