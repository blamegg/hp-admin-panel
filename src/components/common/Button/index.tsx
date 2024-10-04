import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
  name: string;
  onClick?: any;
  type: "submit" | "reset" | "button" | undefined;
  className?: string;
}

const Button = ({ name, onClick, type, className, ...props }: ButtonProps) => {
  const color = useSelector((state: RootState) => state?.app?.color);

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
