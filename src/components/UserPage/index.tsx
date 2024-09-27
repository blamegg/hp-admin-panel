"use client";
import React, { FormEvent, useState } from "react";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import Link from "next/link";
import Image from "next/image";
import Input from "../common/Input";
import { toast } from "react-toastify";

const UserPage = () => {
  const [profile, setProfile] = useState<string>("/images/user/user-06.png");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (event: any) => {
    event.preventDefault();
    toast.success("Created user successfully");
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Create User" />
      <form onSubmit={handleFormSubmit}>
        <div>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Fill Out User Information
              </h3>
              <button
                type="submit"
                className="w-[120px] rounded bg-primary py-[7px] text-white hover:bg-opacity-80"
              >
                Create User
              </button>
            </div>
            <div className="mb-[70px] mt-[100px] px-4 text-center sm:mb-[20px]">
              <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
                <div className="relative h-[160px] w-[160px] rounded-full drop-shadow-2">
                  <Image
                    src={profile}
                    width={160}
                    height={160}
                    style={{
                      borderRadius: "100%",
                    }}
                    className="border-[4px] border-primary"
                    alt="profile"
                    priority
                  />
                  <label
                    htmlFor="profile"
                    className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
                  >
                    <svg
                      className="fill-current"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                        fill=""
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.00004 5.83329C6.03354 5.83329 5.25004 6.61679 5.25004 7.58329C5.25004 8.54979 6.03354 9.33329 7.00004 9.33329C7.96654 9.33329 8.75004 8.54979 8.75004 7.58329C8.75004 6.61679 7.96654 5.83329 7.00004 5.83329ZM4.08337 7.58329C4.08337 5.97246 5.38921 4.66663 7.00004 4.66663C8.61087 4.66663 9.91671 5.97246 9.91671 7.58329C9.91671 9.19412 8.61087 10.5 7.00004 10.5C5.38921 10.5 4.08337 9.19412 4.08337 7.58329Z"
                        fill=""
                      />
                    </svg>
                    <input
                      type="file"
                      name="profile"
                      id="profile"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="px-7 pb-7">
              <div className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2 md:grid-cols-3">
                <div className="mb-5.5">
                  <Input label="First Name" type="text" placeholder="John" />
                </div>

                <div className="mb-5.5">
                  <Input label="Last Name" type="text" placeholder="Doe" />
                </div>

                <div className="mb-5.5">
                  <Input
                    label="Username"
                    type="text"
                    placeholder="johndoe123"
                  />
                </div>

                <div className="mb-5.5">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="example@example.com"
                  />
                </div>

                <div className="mb-5.5">
                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>

                <div className="mb-5.5">
                  <Input
                    label="Phone Number"
                    type="number"
                    placeholder="+990 3343 7865"
                  />
                </div>

                <div className="mb-5.5">
                  <label
                    className="block text-sm font-medium text-black dark:text-white"
                    htmlFor="language"
                  >
                    Language Preference
                  </label>
                  <select
                    className="w-full rounded border border-stroke bg-gray px-4 py-[6px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    name="language"
                    id="language"
                  >
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                  </select>
                </div>

                <div className="mb-5.5">
                  <label
                    className="block text-sm font-medium text-black dark:text-white"
                    htmlFor="direction"
                  >
                    Direction Preference
                  </label>
                  <select
                    className="w-full rounded border border-stroke bg-gray px-4 py-[6px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    name="direction"
                    id="direction"
                  >
                    <option value="ltr">Left to Right (LTR)</option>
                    <option value="rtl">Right to Left (RTL)</option>
                  </select>
                </div>

                <div className="mb-5.5">
                  <label
                    className="block text-sm font-medium text-black dark:text-white"
                    htmlFor="notifications"
                  >
                    Notifications
                  </label>
                  <select
                    className="w-full rounded border border-stroke bg-gray px-4 py-[6px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    name="notifications"
                    id="notifications"
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="push">Push Notifications</option>
                    <option value="none">No Notifications</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserPage;
