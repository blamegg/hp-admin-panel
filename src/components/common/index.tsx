import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  className = '',
  id,
  disabled = false,
}) => {
  return (
    <label className={`inline-flex items-center cursor-pointer gap-2 ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`} htmlFor={id}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="peer appearance-none w-4 h-4 border border-stroke rounded-sm bg-white checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary transition-all duration-200"
      />
      <span className="pointer-events-none w-4 h-4 flex items-center justify-center absolute">
        <svg
          className={`w-3 h-3 text-white transition-opacity duration-200 ${checked ? 'opacity-100' : 'opacity-0'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
      {label && <span className="text-sm text-black dark:text-white select-none ml-1">{label}</span>}
    </label>
  );
};

export default Checkbox; 