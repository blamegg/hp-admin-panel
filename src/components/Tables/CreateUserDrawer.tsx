"use client";
import { Drawer } from "@mui/material";
import React, { useState } from "react";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import Image from "next/image";
import Input from "../common/Input";
import { toast } from "react-toastify";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormError from "../common/FormError";
import Button from "@/components/common/Button";
import { RxCrossCircled } from "react-icons/rx";
import { usercover } from "@/assets";
import Basic from "./UserTab/Basic";
import Company from "./UserTab/Company";
import Personalization from "./UserTab/Personalization";
import { useSelector } from "react-redux";
import ModalHeader from "../common/ModalHeader";

interface UserDrawerProps {
  direction: string;
  toggleDrawer: any;
  isDrawerOpen: boolean;
}

interface RenderTabProps {
  Basic: React.JSX.Element;
  Company: React.JSX.Element;
  Personalization: React.JSX.Element;
}

const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  direction: z.enum(["ltr", "rtl"], {
    errorMap: () => ({ message: "Please select a direction" }),
  }),
  notifications: z.enum(["email", "sms", "push", "none"], {
    errorMap: () => ({ message: "Please select a notification preference" }),
  }),
});

type UserFormInputs = z.infer<typeof userSchema>;

const CreateUserDrawer = ({
  direction,
  isDrawerOpen,
  toggleDrawer,
}: UserDrawerProps) => {
  const [profile, setProfile] = useState<string>("/images/user/user-06.png");
  const [selectedTab, setSelectedTab] = useState<keyof RenderTabProps>("Basic");
  const color = useSelector((state: any) => state?.app?.color);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormInputs>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      phoneNumber: "",
      notifications: undefined,
      direction: undefined,
    },
  });
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

  const onSubmit = (data: UserFormInputs) => {
    toast.success("Created user successfully");
    reset();
  };

  const renderTab: RenderTabProps = {
    Basic: <Basic />,
    Company: <Company />,
    Personalization: <Personalization />,
  };

  return (
    <Drawer
      anchor={direction === "ltr" ? "right" : "left"}
      open={isDrawerOpen}
      disableEnforceFocus
      onClose={toggleDrawer(false)}
      PaperProps={{
        sx: {
          width: "70%",
        },
      }}
    >
      <div role="presentation">
        <form onSubmit={handleSubmit(onSubmit)} className="max-h-[500px]">
          <ModalHeader text={"Create User"} toggleDrawer={toggleDrawer} />

          <div
            className="mb-[70px] mt-[88px] px-4 text-center sm:mb-[20px]"
            style={{
              backgroundImage: `url(${usercover.src})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
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
          <div className="mb-4 ms-10 flex">
            <div className="flex">
              {["Basic", "Company", "Personalization"].map((e: any, i) => (
                <div
                  key={i}
                  className={`cursor-pointer border border-x-2  px-5 py-1 text-[16px] font-medium transition-all duration-200 ease-in-out ${
                    selectedTab === e
                      ? "border border-b-white bg-white text-black"
                      : "border-l-0 border-r-0 border-t-0"
                  }`}
                  onClick={() => {
                    setSelectedTab(e);
                  }}
                >
                  {e}
                </div>
              ))}
            </div>
            <div className="w-full border-b border-black"></div>
          </div>

          <div className="mt-10 px-10">{renderTab[selectedTab]}</div>

          <div className="mt-10 grid place-items-center">
            <Button
              name="Submit"
              type="submit"
              className="mx-7 px-18 py-2 text-[16px]"
              onClick={() => {
                toast.success("Created user successfully");
              }}
            />
          </div>
        </form>
      </div>
    </Drawer>
  );
};

export default CreateUserDrawer;
