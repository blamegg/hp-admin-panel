import React, { useState } from 'react';

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
  const [singleDateInput, setSingleDateInput] = useState('');

  // Convert selectedDates to string for easier comparison
  const selectedDateStrings = selectedDates.map(date => date.toISOString().split('T')[0]);

  const handleAddDate = () => {
    if (!singleDateInput) return;
    if (selectedDateStrings.includes(singleDateInput)) return;
    const newDates = [...selectedDates, new Date(singleDateInput)];
    onChange(newDates);
    setSingleDateInput('');
  };

  const handleRemoveDate = (dateStr: string) => {
    const newDates = selectedDates.filter(date => date.toISOString().split('T')[0] !== dateStr);
    onChange(newDates);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div>
      <label className="block font-medium text-gray-700 mb-1">{label}</label>
      <div className="grid grid-cols-2 gap-4 mb-3">
        <input
          type="date"
          value={singleDateInput}
          onChange={e => setSingleDateInput(e.target.value)}
          className="w-full rounded border text-[13px] font-medium focus:border-primary focus-visible:outline-none dark:border-strokedark dark:focus:border-primary transition-all duration-200 bg-gray px-2 py-[2px] text-black dark:bg-meta-4 dark:text-white border-stroke"
          placeholder="Select a date"
        />
        <button
          type="button"
          onClick={handleAddDate}
          disabled={!singleDateInput}
          className="bg-primary text-white rounded px-4 py-2 font-medium disabled:opacity-50"
        >
          Add
        </button>
      </div>
      {selectedDates.length > 0 && (
        <div className="mb-3">
          <div className="flex items-start justify-start gap-4 mb-2">
            <label className="block font-medium text-gray-600 text-sm">Selected Dates: ( {selectedDates.length} )</label>
            {selectedDates.length > 1 && (
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
            {selectedDates.map((date, idx) => {
              const dateStr = date.toISOString().split('T')[0];
              return (
                <div
                  key={idx}
                  className="flex items-center gap-1 bg-green-100 border border-green-300 rounded px-2 py-1 text-sm"
                >
                  <span className="text-green-800">{dateStr}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDate(dateStr)}
                    className="text-red-500 bg-transparent px-0 hover:text-red-700 text-xs"
                  >
                    &times;
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleDatePicker; 