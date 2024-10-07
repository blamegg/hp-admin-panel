"use client";
import { logo, signingBg } from "@/assets";
import Image from "next/image";
import React, { FormEvent, useState } from "react";
import {
  TextField,
  Button,
  FormControlLabel,
  Switch,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import EmailVerification from "./EmailVerification";

export const ForgotPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showSignIn, setShowSignIn] = useState(true);
  //  const [current, setCurrent] = useState<number>(1);
  const router = useRouter();

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleRememberMeChange = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setRememberMe(event.target.checked);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    console.log("Form submitted");
    router.push("/dashboard");
  };
  const handleSignInClick = () => {
    setShowSignIn(false);
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
        {showSignIn ? (
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

            <form onSubmit={handleSubmit} className="mt-20">
              <div className="relative mb-6">
                <TextField
                  label="Email"
                  type={showPassword ? "text" : "password"}
                  size="small"
                  placeholder="6+ Characters, 1 Capital letter"
                  variant="outlined"
                  fullWidth
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
              </div>
              <div className="relative mb-6">
                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  size="small"
                  placeholder="6+ Characters, 1 Capital letter"
                  variant="outlined"
                  fullWidth
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
              </div>

              <div className="relative mb-6">
                <TextField
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  size="small"
                  placeholder="6+ Characters, 1 Capital letter"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    classes: {
                      root: "bg-transparent border-stroke dark:border-form-strokedark dark:bg-form-input dark:text-white",
                      focused: "border-primary",
                    },
                    endAdornment: (
                      <IconButton
                        onClick={handleToggleConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    ),
                  }}
                  InputLabelProps={{
                    className: "font-medium text-black dark:text-white",
                  }}
                />
              </div>

              <div className="mb-5">
                <Button
                  onClick={handleSignInClick}
                  type="submit"
                  variant="contained"
                  className="w-full cursor-pointer rounded-lg border-primary bg-primary py-2 text-white transition hover:bg-opacity-90"
                >
                  Sign In
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <EmailVerification />
        )}
      </div>

      <p className="relative z-10 mt-6 text-[14px] font-semibold text-white">
        ©️ 2024, made by Hanging Panda for a better web
      </p>
    </div>
  );
};

export default ForgotPassword;
