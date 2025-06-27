import FormError from "../FormError";

interface SelectProps {
  label: string;
  options: { value: string; label: string }[];
  register?: any;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?:string;
}

const Select = ({ label, options, register, error,className, ...props }: SelectProps) => {
  return (
    <>
      <label className="block text-sm font-medium text-black dark:text-white">
        {label}
      </label>
      <select
        className={`w-full rounded border bg-gray px-2 py-[5px] text-xs font-medium text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${
          error ? "border-red" : "border-stroke"
        }`}
        {...register}
        {...props}
      >
        <option value="">
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
