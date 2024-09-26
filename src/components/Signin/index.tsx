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

export const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRememberMeChange = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setRememberMe(event.target.checked);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div
      className="relative grid h-[100vh] place-items-center"
      style={{
        backgroundImage: `url(${signingBg.src})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:w-[25%]">
        <div className="pt-18">
          <div className="w-full rounded-xl border-stroke dark:border-strokedark xl:border-l-2">
            <div className="w-full p-4">
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
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <TextField
                    label="Email"
                    type="email"
                    size="small"
                    placeholder="Enter your email"
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

                <FormControlLabel
                  control={
                    <Switch
                      checked={rememberMe}
                      onChange={handleRememberMeChange}
                      color="primary"
                    />
                  }
                  label="Remember Me"
                  className="mb-5"
                />

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
        </div>
      </div>
      <p className="relative z-1 text-[14px] font-semibold text-white">
        ©️ 2024, made by Hanging Panda for a better web
      </p>
    </div>
  );
};

export default Signin;
