import { logo } from "@/assets";
import Image from "next/image";
import React from "react";
import { twMerge } from "tailwind-merge";

export interface MessageBoxProps {
  role: "sender" | "receiver";
  message?: string;
  time: string;
  children?: React.ReactNode;
  profileImage?: string;
  image?: string | null;
}

const MessageBox = ({
  role,
  children,
  time,
  profileImage,
  image,
}: MessageBoxProps) => {
  const messageBoxClasses = twMerge(
    "w-fit max-w-xs rounded-lg px-4 py-2 text-[14px]",
    role === "sender"
      ? "bg-companyRed text-white rounded-br-none shadow-md"
      : "bg-[#EFF4FB] text-black rounded-tl-none shadow-md",
  );

  return (
    <div className="flex flex-col gap-1">
      <div
        className={twMerge(
          "flex items-center gap-1",
          role === "sender" ? "justify-end" : "justify-start",
        )}
      >
        {role === "receiver" && (
          <Image
            alt="receiver"
            src={profileImage ? profileImage : ""}
            height={35}
            width={35}
            className="rounded-full"
          />
        )}
        {image ? (
          <Image src={image} alt="message" height={900} width={300} />
        ) : (
          <p className={messageBoxClasses}>{children}</p>
        )}

        {role === "sender" && (
          <Image
            alt="logo"
            src={logo.src}
            height={35}
            width={35}
            className="rounded-full"
          />
        )}
      </div>
      <div
        className={twMerge(
          "flex",
          role === "sender" ? "justify-end" : "justify-start",
        )}
      >
        <p
          className={twMerge(
            "text-gray-500 text-[11px]",
            role === "sender" ? "pe-11" : "ps-11",
          )}
        >
          {time}
        </p>
      </div>
    </div>
  );
};

export default MessageBox;
