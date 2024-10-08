"use client";
import { customError, signingBg } from "@/assets";
import { Button } from "@mui/material";


export const CustomPage = () => {
  return (
    <>
      <div className="relative flex h-[100vh] flex-col items-center justify-center border bg-[#f1f5f9] pb-0 pt-8 ">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="justify-cente flex flex-col items-center">
          
          <div className="text-medium  text-base font-medium text-green-950">
            404
          </div>
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-red-600 mb-4 py-10 text-5xl font-bold text-yellow-700">
              404 - Page Not Found
            </h1>
            <p className="text-gray-600 text-lg">
              Oops! The page you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button
              type="submit"
              variant="contained"
              className="w-full cursor-pointer rounded-lg border-primary bg-primary py-2 text-white transition hover:bg-opacity-90"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
