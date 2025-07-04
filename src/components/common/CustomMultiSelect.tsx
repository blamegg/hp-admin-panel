import React, { useState } from "react";
import FormError from "./FormError";

interface CustomMultiSelectProps {
  label?: string;
  value: string[];
  onChange: (selected: string[]) => void;
  error?: string;
  placeholder?: string;
}

const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder = "Add value",
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (value.includes(trimmed)) return;
    onChange([...value, trimmed]);
    setInputValue("");
  };

  const handleRemove = (val: string) => {
    onChange(value.filter((v) => v !== val));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (inputValue.trim() && (e.key === "Enter" || e.key === ",")) {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-black dark:text-white mb-1">{label}</label>
      )}
      <div className="flex gap-4">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          className="w-full rounded border col-span-2  text-[13px] font-medium focus:border-primary focus-visible:outline-none dark:border-strokedark dark:focus:border-primary transition-all duration-200 bg-gray px-2 py-[2px] text-black dark:bg-meta-4 dark:text-white border-stroke"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          className="bg-primary text-white  rounded px-4 py-[2px] font-medium disabled:opacity-50"
        >
          Add
        </button>
      </div>
      {value.length > 0 && (
        <div className="mb-3">
          <div className="flex items-start justify-start gap-4 mb-2">
            <label className="block font-medium text-gray-600 text-sm">Selected: ( {value.length} )</label>
            {value.length > 1 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="bg-danger text-white text-xs rounded px-2 py-1"
              >
                Clear All
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {value.map((val, idx) => (
              <div
                key={val + idx}
                className="flex items-center gap-1 bg-green-100 border border-green-300 rounded px-2 py-1 text-sm"
              >
                <span className="text-green-800">{val}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(val)}
                  className="text-red-500 bg-transparent px-0 hover:text-red-700 text-xs"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {error &&
       <FormError error={error} />
       }
    </div>
  );
};

export default CustomMultiSelect; 