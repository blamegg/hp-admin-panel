"use client";
import { useDirection } from "@/context/DirectionContext";
import { twMerge } from "tailwind-merge";
import { useState } from "react";

const RTLSwitcher = () => {
  const { direction, toggleDirection } = useDirection();
  const [isChecked, setIsChecked] = useState(direction === "rtl");

  const handleToggle = () => {
    setIsChecked(!isChecked);
    toggleDirection();
  };

  return (
    <li>
      <label
        className={`relative m-0 block h-7.5 w-20 rounded-full ${
          isChecked ? "bg-primary" : "bg-stroke"
        }`}
      >
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleToggle}
          className="dur absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0"
        />
        <span
          className={twMerge(
            `absolute left-[3px] top-1/2 flex h-6 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-switcher duration-75 ease-linear ${
              isChecked && "!right-[45px] !translate-x-full"
            }`,
          )}
        >
          {isChecked ? (
            <span className="text-xs font-medium text-primary">RTL</span>
          ) : (
            <span className="text-xs font-medium text-primary">LTR</span>
          )}
        </span>
      </label>
    </li>
  );
};

export default RTLSwitcher;
