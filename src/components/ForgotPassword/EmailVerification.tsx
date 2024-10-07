"use client";
import { logo } from "@/assets";
import Image from "next/image";
import React, { FormEvent, useState } from "react";
import { TextField, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import ResetPassword from "./ResetPassword";

export const OtpVerification = () => {
  const [otp, setOtp] = useState<string>("");
  const [showSignIn, setShowSignIn] = useState(true);
  const router = useRouter();

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("OTP submitted:", otp);

    // API call or OTP verification logic
    router.push("/dashboard");
  };

  const handleSignInClick = () => {
    setShowSignIn(false);
  };
  return (
    <div className="mb-0 w-full !px-4 !pb-0">
      {showSignIn ? (
        <>
          <div className="absolute top-[-59px] w-[90%] rounded-xl bg-[#1976D2] py-3">
            <div className="grid place-items-center">
              <Image src={logo.src} alt="company" width={40} height={40} />
            </div>
            <h2 className="mt-1 text-center text-[18px] font-semibold text-white dark:text-black">
              Hanging Panda
            </h2>
            <h2 className="mt-1 text-center text-[18px] font-semibold text-white dark:text-black">
              OTP Verification
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="mt-20">
            <div className="relative mb-6">
              <div className="mb-5 flex items-center justify-center">
                <p className="text-sm font-medium text-black">
                  We sent a code to{" "}
                  <span className="font-semibold text-primary">
                    user@gmail.com
                  </span>
                </p>
              </div>
              <TextField
                label="Enter OTP"
                value={otp}
                onChange={handleOtpChange}
                type="text"
                size="small"
                placeholder="Enter 6-digit OTP"
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

            <div className="mb-5">
              <Button
                onClick={handleSignInClick}
                type="submit"
                variant="contained"
                className="w-full cursor-pointer rounded-lg border-primary bg-primary py-2 text-white transition hover:bg-opacity-90"
              >
                Verify OTP
              </Button>
            </div>
          </form>
        </>
      ) : (
        <ResetPassword />
      )}
    </div>
  );
};

export default OtpVerification;
