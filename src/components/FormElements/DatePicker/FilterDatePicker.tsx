import React, { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';

interface FilterDatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
}

const FilterDatePicker: React.FC<FilterDatePickerProps> = ({ value, onChange, placeholder = 'Select date' }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      const fp = flatpickr(inputRef.current, {
        mode: 'single',
        static: true,
        monthSelectorType: 'static',
        dateFormat: 'Y-m-d',
        ...(value && { defaultDate: value }),
        onChange: (selectedDates) => {
          onChange(selectedDates[0] || null);
        },
        prevArrow:
          '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
        nextArrow:
          '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
      });

      return () => {
        fp.destroy();
      };
    }
  }, []);

  // Update flatpickr instance if the value prop changes from outside
  useEffect(() => {
    if (inputRef.current && (inputRef.current as any)._flatpickr) {
      (inputRef.current as any)._flatpickr.setDate(value, false);
    }
  }, [value]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-2 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        placeholder={placeholder}
        data-class="flatpickr-right"
      />
    </div>
  );
};

export default FilterDatePicker; 