"use client";
import { logo } from "@/assets";
import Image from "next/image";
import React, { FormEvent, useState } from "react";
import { TextField, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import ResetPassword from "./ResetPassword";

interface EmailVerificationProps {
  email: string;
}

export const EmailVerification = ({ email }: EmailVerificationProps) => {
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [showSignIn, setShowSignIn] = useState(true);
  const [state, setState] = useState({
    logoVisible: true,
    heading: "Hanging Panda",
    subHeading: "OTP Verification",
  });
  const router = useRouter();

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setOtp(value.substring(0, 6));

    if (value.length < 6) {
      setError("OTP must be exactly 6 digits.");
    } else {
      setError("");
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError("OTP must be exactly 6 digits.");
    } else {
      setError("");
      console.log("OTP submitted:", otp);
      router.push("/dashboard");
    }
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
            <div className="relative mb-6">
              <p className="mb-5 text-sm font-medium text-black">
                We sent a code to{" "}
                <span className="font-semibold text-primary">{email}</span>
              </p>

              <div>
                <TextField
                  label="Enter OTP"
                  value={otp}
                  onChange={handleOtpChange}
                  type="text"
                  size="small"
                  placeholder="Enter 6-digit OTP"
                  variant="outlined"
                  fullWidth
                  error={!!error}
                  helperText={error}
                />
              </div>
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

export default EmailVerification;
