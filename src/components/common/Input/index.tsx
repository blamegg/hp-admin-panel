import React from "react";
import FormError from "../FormError";

interface InputProps {
  label: string;
  placeholder: string;
  type: "text" | "email" | "number" | "password";
  register: any;
  error?: string;
}

const Input = ({
  label,
  placeholder,
  type,
  register,
  error,
  ...props
}: InputProps) => {
  return (
    <>
      <label className="block text-sm font-medium text-black dark:text-white">
        {label}
      </label>
      <input
        className={`w-full rounded border bg-gray px-4 py-[6px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${
          error ? "border-red" : "border-stroke"
        }`}
        type={type}
        placeholder={placeholder}
        {...register}
        {...props}
      />
      <FormError error={error} />
    </>
  );
};

export default Input;
