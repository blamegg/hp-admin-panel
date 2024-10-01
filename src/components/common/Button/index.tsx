import React from "react";
import { useSelector } from "react-redux";
// import { RootState } from "@/store"; // Import the root state type
import { twMerge } from "tailwind-merge";

interface ButtonProps {
  name: string;
  onClick?: any;
  type: "submit" | "reset" | "button" | undefined;
  className?: string;
}

const Button = ({ name, onClick, type, className, ...props }: ButtonProps) => {
  // Access the color from the Redux state
  const color = useSelector((state) => state?.app?.color);
  console.log(color, "color");

  return (
    <button
      type={type}
      onClick={onClick}
      {...props}
      className={twMerge(
        `w-max rounded px-4 py-[3px] text-[14px] text-white hover:bg-opacity-80`,
        className,
      )}
      style={{ backgroundColor: color }}
    >
      {name}
    </button>
  );
};

export default Button;
