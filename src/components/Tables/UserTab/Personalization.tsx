import React from "react";
import Input from "@/components/common/Input";
import { useDispatch } from "react-redux";
import { changeColor } from "@/redux/slice/appSlice";
import Select from "@/components/common/Select";

const Personalization = ({ register, errors }: any) => {
  const dispatch = useDispatch();

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeColor(e.target.value));
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div>
        <Select
          label="Notifications"
          options={[
            { value: "email", label: "Email" },
            { value: "sms", label: "SMS" },
            { value: "push", label: "Push Notifications" },
            { value: "none", label: "No Notifications" },
          ]}
          register={register("notifications")}
          error={errors.notifications?.message}
        />
      </div>
      <div>
        <Select
          label="Direction Preference"
          options={[
            { value: "ltr", label: "Left to Right (LTR)" },
            { value: "rtl", label: "Right to Left (RTL)" },
          ]}
          register={register("direction")}
          error={errors.direction?.message}
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium text-black dark:text-white"
          htmlFor="appColor"
        >
          App Color
        </label>
        <input
          type="color"
          id="appColor"
          className="w-full rounded border border-stroke bg-gray text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
          onChange={handleColorChange}
        />
      </div>
      <div>
        <Select
          label="Font Size"
          options={[
            { value: "small", label: "Small" },
            { value: "medium", label: "Medium" },
            { value: "large", label: "Large" },
          ]}
          register={register("fontSize")}
          error={errors.fontSize?.message}
        />
      </div>
      <div>
        <Select
          label="Theme"
          options={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
          ]}
          register={register("theme")}
          error={errors.theme?.message}
        />
      </div>
      <div>
        <Input
          label="Custom Message"
          type="text"
          placeholder="Custom message"
          register={register("customMessage")}
          error={errors.customMessage?.message}
        />
      </div>
    </div>
  );
};

export default Personalization;
