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
import Link from "next/link";

export const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const router = useRouter();

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRememberMeChange = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setRememberMe(event.target.checked);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return (
      password.length >= 8 && /[A-Z]/.test(password) && !/\s/.test(password)
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
    }

    if (!validatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters long, contain at least one uppercase letter and also a number, and cannot contain spaces.",
      );
    }

    if (validateEmail(email) && validatePassword(password)) {
      router.push("/dashboard");
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

          <form onSubmit={handleSubmit} className="mt-20">
            <div className="mb-4">
              <TextField
                label="Email"
                type="email"
                size="small"
                placeholder="Enter your email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!emailError}
                helperText={emailError}
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
                placeholder="8+ Characters, 1 Capital letter"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value.replace(/\s/g, ""))} // Disallow spaces
                error={!!passwordError}
                helperText={passwordError}
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
                  className="text-base font-medium text-blue-500"
                >
                  Forgot Password
                </Link>
              </div>
            </div>
            <div className="mb-5">
              <Button
                type="submit"
                variant="contained"
                className="w-full cursor-pointer rounded-lg border-primary bg-primary py-2 text-white transition hover:bg-opacity-90"
              >
                Sign In
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

export default Signin;
