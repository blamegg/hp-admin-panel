import React from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
  name: string;
  onClick?: any;
  type: "submit" | "reset" | "button" | undefined;
  className?: string;
}

const Button = ({ name, onClick, type, className, ...props }: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      {...props}
      className={twMerge(
        `w-max rounded bg-companyRed px-4 py-[3px] text-[14px] text-white hover:bg-opacity-80`,
        className,
      )}
    >
      {name}
    </button>
  );
};

export default Button;
