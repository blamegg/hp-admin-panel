"use client";
import { logo, signingBg } from "@/assets";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  FormControlLabel,
  Switch,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "@/redux/slice/authSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().nonempty("Name is required."),
  email: z
    .string()
    .nonempty("Email is required.")
    .email("Please enter a valid email address."),
  password: z
    .string()
    .nonempty("Password is required.")
    .min(8, "Password must be at least 8 characters long."),
  mobile: z
    .string()
    .nonempty("Mobile number is required.")
    .length(10, "Mobile number must be 10 digits long.")
    .regex(/^[0-9]+$/, "Mobile number must be numeric."),
});

export interface SignInFormData {
  name: string;
  email: string;
  password: string;
  mobile: string;
}

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(schema),
  });
  const dispatch = useDispatch<AppDispatch>();

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data: SignInFormData) => {
    let toastMessage = "";

    try {
      const result = await dispatch(
        registerUser({ ...data, status: 1 }),
      ).unwrap();
      toastMessage = result.message || "Registration successful!";
      toast.success(toastMessage);
      reset();
    } catch (error: any) {
      toastMessage = error || "Registration failed. Please try again.";
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

      <div className="relative z-10 flex w-[70%] flex-col items-center justify-center rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:w-[50%] xl:w-[25%]">
        <div className="w-full px-4 pb-2 pt-4">
          <div className="absolute top-[-59px] w-[90%] rounded-xl bg-[#1976D2] py-3">
            <div className="grid place-items-center">
              <Image src={logo.src} alt="company" width={40} height={40} />
            </div>
            <h2 className="mt-1 text-center text-[18px] font-semibold text-white dark:text-black">
              Hanging Panda
            </h2>
            <h2 className="mt-1 text-center text-[18px] font-semibold text-white dark:text-black">
              Sign Up
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-20">
            <div className="mb-4">
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    label="Name"
                    type="text"
                    size="small"
                    placeholder="Enter your name"
                    variant="outlined"
                    fullWidth
                    {...field}
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ""}
                    InputProps={{
                      classes: {
                        root: "bg-transparent border-stroke dark:border-strokedark dark:bg-form-input dark:text-white",
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
                        root: "bg-transparent border-stroke dark:border-strokedark dark:bg-form-input dark:text-white",
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
                        root: "bg-transparent border-stroke dark:border-strokedark dark:bg-form-input dark:text-white",
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

            <div className="mb-4">
              <Controller
                name="mobile"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    label="Mobile"
                    type="number"
                    size="small"
                    placeholder="Enter your mobile number"
                    variant="outlined"
                    fullWidth
                    {...field}
                    error={!!errors.mobile}
                    helperText={errors.mobile ? errors.mobile.message : ""}
                    InputProps={{
                      classes: {
                        root: "bg-transparent border-stroke dark:border-strokedark dark:bg-form-input dark:text-white",
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

            <div className="mb-5">
              <div className="mb-3 font-semibold">
                <p>
                  Already have an account?{" "}
                  <Link href="/" className="text-primary">
                    Sign In
                  </Link>
                </p>
              </div>
              <Button
                type="submit"
                variant="contained"
                className="w-full cursor-pointer rounded-lg border-primary bg-primary py-2 text-white transition hover:bg-opacity-90"
              >
                Register
              </Button>
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

export default Register;
