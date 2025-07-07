import React, { useRef, useState } from "react";
import FormError from "../FormError";

interface InputProps {
  label: string;
  placeholder: string;
  type: "text" | "email" | "number" | "password" | "file" | "date";
  register?: any;
  error?: string;
  disabled?: boolean;
  autofocus?: boolean;
  id?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const getInputClassName = () => {
    return "w-full rounded  text-[13px] font-medium  border border-stroke focus:border-primary focus-visible:outline-none dark:border-strokedark dark:focus:border-primary transition-all duration-200 bg-gray px-2 py-[2px] text-black dark:bg-meta-4 dark:text-white";
  };

  if (type === "file") {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setFileName(e.target.files[0].name);
      } else {
        setFileName("");
      }

      // Call react-hook-form's registered onChange
      if (register?.onChange) {
        register.onChange(e);
      }

      // Call your component's onChange
      if (onChange) {
        onChange(e);
      }
    };


    return (
      <div>
        {label && (
          <label className="block text-xs font-medium text-black dark:text-white mb-1">{label}</label>
        )}
        <div className="flex gap-2 items-center">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            style={{ display: "none" }}
            onChange={handleFileChange}
            {...register}
          />

          <button
            type="button"
            className="px-3 py-[6px] w-[150px] rounded bg-primary text-white text-xs font-medium hover:bg-primary/80 transition-colors"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.click();
              }
            }}
          >
            Choose File
          </button>
          <input
            type="text"
            className="w-full rounded border text-[13px] font-medium focus:border-primary focus-visible:outline-none dark:border-strokedark dark:focus:border-primary transition-all duration-200 bg-gray px-2 py-[2px] text-black dark:bg-meta-4 dark:text-white"
            value={fileName || "No file selected"}
            placeholder={placeholder}
            readOnly
            tabIndex={-1}
          />
        </div>
        <FormError error={error} />
      </div>
    );
  }

  return (
    <>
      {label && (
        <label className="block text-xs font-medium text-black dark:text-white mb-1">
          {label}
        </label>
      )}
      <input
        className={getInputClassName()}
        type={type}
        placeholder={placeholder}
        accept={accept}
        multiple={multiple}
        id={id}
        autoFocus={autofocus}
        {...(register
          ? { ...register }
          : {
              value,
              onChange,
            })}
        {...props}
      />
      <FormError error={error} />
    </>
  );
};

export default Input;
