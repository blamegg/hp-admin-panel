"use client";
import { logo } from "@/assets";
import Image from "next/image";
import React, { FormEvent, useState } from "react";
import { TextField, Button, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [state, setState] = useState({
    logoVisible: true,
    heading: "Hanging Panda",
    subHeading: "New Password",
  });
  const router = useRouter();

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!/\d/.test(password)) {
      setError("Password must contain at least one number.");
      return;
    }

    console.log("Form submitted with Password:", password);
    router.push("/dashboard");
  };

  return (
    <div className="w-full px-2 pb-2 pt-4">
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
      <form onSubmit={handleSubmit} className="mt-20 ">
        <div className="relative mb-6">
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            size="small"
            placeholder="6+ Characters, 1 Capital letter, 1 Number"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            error={!!error}
            helperText={error && password !== "" ? error : ""}
          />
        </div>

        <div className="relative mb-6">
          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            size="small"
            placeholder="6+ Characters, 1 Capital letter, 1 Number"
            variant="outlined"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              classes: {
                root: "bg-transparent border-stroke dark:border-form-strokedark dark:bg-form-input dark:text-white",
                focused: "border-primary",
              },
              endAdornment: (
                <IconButton onClick={handleToggleConfirmPassword} edge="end">
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
            InputLabelProps={{
              className: "font-medium text-black dark:text-white",
            }}
            error={!!error && confirmPassword !== ""}
            helperText={error && confirmPassword !== "" ? error : ""}
          />
        </div>

        <div className="mb-5">
          <Button
            type="submit"
            variant="contained"
            className="w-full cursor-pointer rounded-lg border-primary bg-primary py-2 text-white transition hover:bg-opacity-90"
          >
            Confirm Password
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
