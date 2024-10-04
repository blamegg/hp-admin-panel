"use client";
// import { customError, signingBg } from "@/assets";
import { Button } from "@mui/material";
import Link from "next/link";

const NotFound = () => {
  return (
    <>
      <div className="relative flex h-[100vh] flex-col items-center justify-center bg-[#f1f5f9] px-10  pb-0 pt-8">
        <div className="flex min-h-96 flex-col items-center justify-center rounded-lg bg-white px-4 shadow-2xl">
          <div className="text-medium text-8xl font-bold text-yellow-700">
            404
          </div>
          <div className="flex flex-col items-center justify-center">
            <h1 className="py-4 text-3xl font-bold text-yellow-700">
              Page Not Found
            </h1>
            <p className="text-gray-600 text-lg">
              Oops! The page you're looking for doesn't exist.
            </p>
            <Link href="/dashboard">
              <Button
                type="submit"
                variant="contained"
                className="!mt-6 mb-10 box-border w-full cursor-pointer rounded-lg !border-primary !bg-primary text-white transition hover:bg-opacity-90"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
