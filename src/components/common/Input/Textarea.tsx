import React from "react";
import FormError from "../FormError";

interface TextareaProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  className?: string;
  id?: string;
  rows?: number;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  className = "",
  id,
  rows = 4,
}) => (
  <>
    <label className="block text-sm font-medium text-black dark:text-white" htmlFor={id}>
      {label}
    </label>
    <textarea
      id={id}
      className={`w-full rounded border text-[13px] font-medium focus:border-primary focus-visible:outline-none dark:border-strokedark dark:focus:border-primary transition-all duration-200 bg-gray px-2 py-[2px] text-black dark:bg-meta-4 dark:text-white ${error ? "border-red" : "border-stroke"} ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
    />
    <FormError error={error} />
  </>
);

export default Textarea; 