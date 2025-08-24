import React from "react";

interface CheckboxFourProps {
  label: string;
  id: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement> | boolean) => void;
  disabled?: boolean;
  className?: string;
}

const CheckboxFour: React.FC<CheckboxFourProps> = ({
  label,
  id,
  checked,
  onChange,
  disabled = false,
  className = "",
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className={`flex  cursor-pointer select-none items-center text-xs font-medium text-black dark:text-white ${className}`}
      >
        <div className="relative">
          <input
            type="checkbox"
            id={id}
            className="sr-only"
            checked={checked}
            onChange={e => onChange(e)}
            disabled={disabled}
          />
          <div
            className={`mr-1 flex h-3 w-3 items-center justify-center rounded-full  border bg-gray ${checked ? "border-primary" : ""}`}
          >
            <span
              className={`h-full w-full rounded-full bg-transparent ${checked ? "!bg-primary" : ""}`}
            >
              {" "}
            </span>
          </div>
        </div>
        {label}
      </label>
    </div>
  );
};

export default CheckboxFour;
