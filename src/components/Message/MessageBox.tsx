import React from "react";
import { twMerge } from "tailwind-merge";

export interface MessageBoxProps {
  role: "sender" | "receiver";
  message?: string;
  time: string;
  children?: React.ReactNode;
}

const MessageBox = ({ role, children, time }: MessageBoxProps) => {
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
          "flex",
          role === "sender" ? "justify-end" : "justify-start",
        )}
      >
        <p className={messageBoxClasses}>{children}</p>
      </div>

      <div
        className={twMerge(
          "flex",
          role === "sender" ? "justify-end" : "justify-start",
        )}
      >
        <p className="text-gray-500 ps-2 text-[11px]">{time}</p>
      </div>
    </div>
  );
};

export default MessageBox;
