"use client";
import { logo, signingBg } from "@/assets";
import Image from "next/image";
import React, { FormEvent, useState } from "react";
import { TextField, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import EmailVerification from "./EmailVerification";

export const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [showSignIn, setShowSignIn] = useState(true);

  const [state, setState] = useState({
    logoVisible: true,
    heading: "Hanging Panda",
    subHeading: "Sign In... OTP",
  });

  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
      setShowSignIn(false);
    }
  };
  const updateState = (newState: Partial<typeof state>) => {
    setState((prevState) => ({
      ...prevState,
      ...newState,
    }));
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
          <div className="w-full p-4 py-4">
            <div className="absolute top-[-59px] w-[90%] rounded-xl bg-[#1976D2] py-3">
              <div className="grid place-items-center">
                {state.logoVisible && (
                  <Image src={logo.src} alt="company" width={40} height={40} />
                )}
              </div>

              <h2 className="mt-1 text-center text-[18px] font-semibold text-white dark:text-black">
                {state.heading}
              </h2>

              <h2 className="mt-1 text-center text-[18px] font-semibold text-white dark:text-black">
                {state.subHeading}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="mt-20">
              <p className="mb-5 text-sm font-medium text-black">
                We are sending a code to your{" "}
                <span className="font-semibold text-primary">Email</span>
              </p>

              {/* Email Input */}
              <div className="relative mb-6">
                <TextField
                  label="Enter Email"
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

              <Button
                type="submit"
                variant="contained"
                className="w-full cursor-pointer rounded-lg border-primary bg-primary py-2 text-white transition hover:bg-opacity-90"
              >
                Send OTP
              </Button>
            </form>
          </div>
        ) : (
          <EmailVerification email={email} />
        )}
      </div>

      <p className="absolute bottom-2 left-0 z-10 w-full text-center text-[14px] font-semibold text-white">
        ©️ 2024, made by Hanging Panda for a better web
      </p>
    </div>
  );
};

export default ForgotPassword;
