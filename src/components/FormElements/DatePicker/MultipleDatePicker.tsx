import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import React, { useEffect, useRef } from 'react';

interface MultipleDatePickerProps {
  label: string;
  selectedDates: Date[];
  onChange: (dates: Date[]) => void;
}

const MultipleDatePicker: React.FC<MultipleDatePickerProps> = ({
  label,
  selectedDates,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      const fp = flatpickr(inputRef.current, {
        mode: 'multiple',
        dateFormat: 'Y-m-d',
        defaultDate: selectedDates,
        onChange: (dates) => {
          onChange(dates);
        },
        prevArrow:
          '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
        nextArrow:
          '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
      });
      return () => fp.destroy();
    }
  }, [onChange]); // Removed selectedDates from dependencies to avoid re-initialization

  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          className="w-full rounded border text-[13px] font-medium focus:border-primary focus-visible:outline-none dark:border-strokedark dark:focus:border-primary transition-all duration-200 bg-gray px-2 py-[2px] text-black dark:bg-meta-4 dark:text-white border-stroke"
          placeholder="Select multiple dates"
          readOnly
        />
      </div>
    </div>
  );
};

export default MultipleDatePicker; 