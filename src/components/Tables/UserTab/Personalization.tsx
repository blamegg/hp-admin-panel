import Input from "@/components/common/Input";
import { changeColor } from "@/redux/slice/appSlice";
import React from "react";
import { useDispatch } from "react-redux";
import { z } from "zod";

const schema = z.object({
  notifications: z.enum(["email", "sms", "push", "none"], {
    required_error: "Notification preference is required",
  }),
  direction: z.enum(["ltr", "rtl"], {
    required_error: "Direction preference is required",
  }),
  appColor: z.string().nonempty("App color is required"),
  fontSize: z.enum(["small", "medium", "large"], {
    required_error: "Font size is required",
  }),
  theme: z.enum(["light", "dark"], {
    required_error: "Theme selection is required",
  }),
  customMessage: z.string().optional(),
});

const Personalization = ({ control, register,  errors  }: any) => {
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
          {...register("notifications")}
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
        {errors.notifications && (
          <p className="text-red-600">{errors.notifications.message}</p>
        )}
      </div>
      <div>
        <label
          className="block text-sm font-medium text-black dark:text-white"
          htmlFor="direction"
        >
          Direction Preference
        </label>
        <select
          {...register("direction")}
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
        {errors.direction && (
          <p className="text-red-600">{errors.direction.message}</p>
        )}
      </div>
      <div>
        <label
          className="block text-sm font-medium text-black dark:text-white"
          htmlFor="appColor"
        >
          App Color
        </label>
        <input
          {...register("appColor")}
          type="color"
          id="appColor"
          className="w-full rounded border border-stroke bg-gray text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
          onChange={handleColorChange}
        />
        {errors.appColor && (
          <p className="text-red-600">{errors.appColor.message}</p>
        )}
      </div>
      <div>
        <label
          className="block text-sm font-medium text-black dark:text-white"
          htmlFor="fontSize"
        >
          Font Size
        </label>
        <select
          {...register("fontSize")}
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
        {errors.fontSize && (
          <p className="text-red-600">{errors.fontSize.message}</p>
        )}
      </div>
      <div>
        <label
          className="block text-sm font-medium text-black dark:text-white"
          htmlFor="theme"
        >
          Theme
        </label>
        <select
          {...register("theme")}
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
        {errors.theme && <p className="text-red-600">{errors.theme.message}</p>}
      </div>
      <div>
        <Input
          {...register("customMessage")}
          label="Custom Message"
          type="text"
          placeholder="Custom message"
        />
        {errors.customMessage && (
          <p className="text-red-600">{errors.customMessage.message}</p>
        )}
      </div>
    </div>
  );
};

export default Personalization;
