import React from "react";

interface InputProps {
  label: string;
  placeholder: string;
  type: "text" | "email" | "number" | "password";
}

const Input = ({ label, placeholder, type, ...props }: InputProps) => {
  return (
    <>
      <label className="block text-sm font-medium text-black dark:text-white">
        {label}
      </label>
      <input
        className="w-full rounded border border-stroke bg-gray px-4 py-[6px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
        type={type}
        placeholder={placeholder}
        // required
        {...props}
      />
    </>
  );
};

export default Input;
