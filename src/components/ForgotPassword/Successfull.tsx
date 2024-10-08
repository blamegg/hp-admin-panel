"use client";

import React from "react";
import { FaCheck } from "react-icons/fa";


export const Success = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <span className="rounded-full bg-green-500 p-[10px] text-[20px] text-white">
        <FaCheck />
      </span>
      <span className="text-lg font-semibold text-green-700">
        Password changed successfully
      </span>

      <button className="w-full cursor-pointer rounded-lg border-primary bg-primary py-2 text-white transition hover:bg-opacity-90 ">
        Go To Login
      </button>
    </div>
  );
};

export default Success;
