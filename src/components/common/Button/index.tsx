import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
  name: string;
  onClick?: () => void;
  type: "submit" | "reset" | "button" | undefined;
  className?: string;
  loading?: boolean;
  loadingSpinnerClassName?: string;
}

const Button = ({
  name,
  onClick,
  type,
  className,
  loading = false,
  loadingSpinnerClassName,
  ...props
}: ButtonProps) => {
  const color = useSelector((state: RootState) => state?.app?.color);

  return (
    <button
      type={type}
      onClick={onClick}
      {...props}
      disabled={loading}
      className={twMerge(
        `flex w-max items-center justify-center rounded px-4 py-[3px] text-[14px] text-white outline-none hover:bg-opacity-80`,
        loading && "cursor-not-allowed opacity-70",
        className,
      )}
      style={{ backgroundColor: color }}
    >
      {loading ? (
        <span
          className={twMerge(
            "loader mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-2 border-white",
            loadingSpinnerClassName,
          )}
        ></span>
      ) : (
        name
      )}
    </button>
  );
};

export default Button;
