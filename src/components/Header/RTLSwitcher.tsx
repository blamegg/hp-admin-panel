"use client";
import { useDirection } from "@/context/DirectionContext";
import { useState } from "react";

const RTLSwitcher = () => {
  const { direction, toggleDirection } = useDirection();
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
    toggleDirection();
  };

  return (
    <>
      <label className="custom-switch relative flex w-max cursor-pointer select-none items-center">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleToggle}
          className="h-7 w-14 cursor-pointer appearance-none rounded-full bg-red transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
        />
        <span className="absolute right-1 text-xs font-medium uppercase text-white">
          {" "}
          LTR
        </span>
        <span className="absolute right-8 text-xs font-medium uppercase text-white">
          {" "}
          RTL
        </span>
        <span
          className={`absolute right-7 h-7 w-7 transform rounded-full bg-graydark transition-transform ${
            isChecked ? "translate-x-7" : "translate-x-0"
          }`}
        />
      </label>
    </>
  );
};

export default RTLSwitcher;
