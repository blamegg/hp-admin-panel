import FormError from "../FormError";

interface SelectProps {
  label: string;
  options: { value: string; label: string }[];
  register?: any;
  error?: string;
}

const Select = ({ label, options, register, error, ...props }: SelectProps) => {
  return (
    <>
      <label className="block text-sm font-medium text-black dark:text-white">
        {label}
      </label>
      <select
        className={`w-full rounded border bg-gray px-2 py-[5px] text-[13px] font-medium text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${
          error ? "border-red" : "border-stroke"
        }`}
        defaultValue=""
        {...register}
        {...props}
      >
        <option value="" disabled>
          Select {label}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FormError error={error} />
    </>
  );
};

export default Select;
