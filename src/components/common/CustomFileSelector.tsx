import React, { useRef, useState } from "react";
import FormError from "./FormError";

interface CustomFileSelectorProps {
  label?: string;
  error?: string;
  accept?: string;
  multiple?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  register?: any; // Accept register prop
}

const CustomFileSelector: React.FC<CustomFileSelectorProps> = ({
  label,
  error,
  accept,
  multiple,
  onChange,
  placeholder,
  register,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("");
    }
    if (onChange) onChange(e);
  };

  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-black dark:text-white mb-1">{label}</label>
      )}
      <div className="flex gap-4 items-center">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          style={{ display: "none" }}
          onChange={handleFileChange}
          {...(register ? register : {})}
        />
        <input
          type="text"
          className="w-full rounded  text-[13px] font-medium focus:border-primary focus-visible:outline-none dark:border-strokedark dark:focus:border-primary transition-all duration-200 bg-gray px-2 py-[2px] text-black dark:bg-meta-4 dark:text-white"
          value={fileName || "No file selected"}
          placeholder={placeholder}
          readOnly
          tabIndex={-1}
        />
        <button
          type="button"
          className=" py-[6px] w-[150px] rounded bg-primary text-white text-xs font-medium hover:bg-primary/80 transition-colors"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          Choose File
        </button>
      </div>
      {error && <FormError error={error}  />}
    </div>
  );
};

export default CustomFileSelector; 