import React from "react";
import FormError from "../FormError";

interface InputProps {
  label: string;
  placeholder: string;
  type: "text" | "email" | "number" | "password";
  register?: any;
  error?: string;
  disabled?: boolean;
  autofocus?:boolean;
  id?:string;
  value?:string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?:string;
}

const Input = ({
  onChange,
  autofocus,
  label,
  placeholder,
  type,
  register,
  error,
  value,
  id,
  className,
  ...props
}: InputProps) => {
  return (
    <>
      <label className="block text-sm font-medium text-black dark:text-white">
        {label}
      </label>
      <input
        className={`w-full rounded border bg-gray px-2 py-[2px] text-[13px] font-medium text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${
          error ? "border-red" : "border-stroke"
        }`}
        type={type}
        placeholder={placeholder}
        {...register}
        {...props}
        value={value}
        onChange={onChange}
        id={id}
        autoFocus={autofocus}
      />
      <FormError error={error} />
    </>
  );
};

export default Input;
