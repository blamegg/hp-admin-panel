import React from "react";
import FormError from "../FormError";

interface InputProps {
  label: string;
  placeholder: string;
  type: "text" | "email" | "number" | "password" | "file" | "date";
  register?: any;
  error?: string;
  disabled?: boolean;
  autofocus?:boolean;
  id?:string;
  value?:string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?:string;
  accept?: string;
  multiple?: boolean;
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
  accept,
  multiple,
  ...props
}: InputProps) => {
  // Custom styling for file inputs
  const getInputClassName = () => {
    const baseClass = "w-full rounded border text-[13px] font-medium focus:border-primary focus-visible:outline-none dark:border-strokedark dark:focus:border-primary transition-all duration-200";
    
    if (type === "file") {
      return `${baseClass} cursor-pointer file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80 file:cursor-pointer file:transition-colors bg-white dark:bg-meta-4 dark:text-white border-dashed hover:border-primary/60 ${error ? "border-red" : "border-stroke"}`;
    }
    
    return `${baseClass} bg-gray px-2 py-[2px] text-black dark:bg-meta-4 dark:text-white ${error ? "border-red" : "border-stroke"}`;
  };

  return (
    <>
      <label className="block text-sm font-medium text-black dark:text-white">
        {label}
      </label>
      <input
        className={getInputClassName()}
        type={type}
        placeholder={placeholder}
        accept={accept}
        multiple={multiple}
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