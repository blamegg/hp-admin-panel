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
        className={`flex cursor-pointer select-none items-center text-sm font-medium text-black dark:text-white ${className}`}
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
            className={`mr-2 flex h-5 w-5 items-center justify-center rounded-full border ${checked ? "border-primary" : ""}`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full bg-transparent ${checked ? "!bg-primary" : ""}`}
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
