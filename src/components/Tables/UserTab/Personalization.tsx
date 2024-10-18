import Input from "@/components/common/Input";
import { changeColor } from "@/redux/slice/appSlice";
import React from "react";
import { useDispatch } from "react-redux";

const Personalization = () => {
  const dispatch = useDispatch();

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeColor(e.target.value));
    console.log(e.target.value);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div>
        <label
          className="block text-sm font-medium text-black dark:text-white"
          htmlFor="notifications"
        >
          Notifications
        </label>
        <select
          className="w-full rounded border border-stroke bg-gray px-2 py-[4px] text-[13px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
          id="notifications"
          defaultValue=""
        >
          <option value="" disabled>
            Select Notification
          </option>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="push">Push Notifications</option>
          <option value="none">No Notifications</option>
        </select>
      </div>
      {/* Direction Preference Select */}
      <div>
        <label
          className="block text-sm font-medium text-black dark:text-white"
          htmlFor="direction"
        >
          Direction Preference
        </label>
        <select
          className="w-full rounded border border-stroke bg-gray px-2 py-[4px] text-[13px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
          id="direction"
          defaultValue=""
        >
          <option value="" disabled>
            Select Direction
          </option>
          <option value="ltr">Left to Right (LTR)</option>
          <option value="rtl">Right to Left (RTL)</option>
        </select>
      </div>
      {/* App Color Input */}
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
      {/* Font Size Select */}
      <div>
        <label
          className="block text-sm font-medium text-black dark:text-white"
          htmlFor="fontSize"
        >
          Font Size
        </label>
        <select
          className="w-full rounded border border-stroke bg-gray px-2 py-[4px] text-[13px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
          id="fontSize"
          defaultValue=""
        >
          <option value="" disabled>
            Select Font Size
          </option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
      {/* Theme Select */}
      <div>
        <label
          className="block text-sm font-medium text-black dark:text-white"
          htmlFor="theme"
        >
          Theme
        </label>
        <select
          className="w-full rounded border border-stroke bg-gray px-2 py-[4px] text-[13px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
          id="theme"
          defaultValue=""
        >
          <option value="" disabled>
            Select Theme
          </option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      {/* Custom Message Input */}
      <div>
        <Input
          label="Custom Message"
          type="text"
          placeholder="Custom message"
        />
      </div>
    </div>
  );
};

export default Personalization;
