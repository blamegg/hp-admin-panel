import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
  name: string;
  onClick?: () => void;
  type: "submit" | "reset" | "button" | undefined;
  disabled?:boolean;
  className?: string;
  loading?: boolean;
  loadingSpinnerClassName?: string;
  style?: React.CSSProperties;
}

const Button = ({
  name,
  onClick,
  type,
  className,
  loading = false,
  loadingSpinnerClassName,
  disabled,
  style,
  ...rest
}: ButtonProps) => {
  const color = useSelector((state: RootState) => state?.app?.color);

  return (
    <button
      type={type}
      onClick={onClick}
      {...rest}
      disabled={loading || disabled}
      className={twMerge(
        `relative flex w-max bg-primary items-center justify-center rounded px-4 py-[3px] text-[14px] text-white outline-none transition-all duration-200 ease-in-out hover:bg-opacity-80`,
        loading && "cursor-not-allowed opacity-70",
        className,
      )}
      // style={{backgroundColor:`${color}`}}
    >
      {loading ? (
        <>
          <span
            className={twMerge(
              "absolute left-0 right-0 mx-auto h-5 w-5 animate-spin rounded-full border-2 border-t-2 border-white",
              loadingSpinnerClassName,
            )}
            style={{
              borderColor: "rgba(255, 255, 255, 0.4)",
              borderTopColor: "#fff",
            }}
          ></span>
          <span className="opacity-0">{name}</span>
        </>
      ) : (
        name
      )}
    </button>
  );
};

export default Button;
