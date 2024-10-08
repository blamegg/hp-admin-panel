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
    "w-fit rounded-lg px-3 py-1 text-[14px] text-white",
    role === "sender"
      ? "bg-companyRed rounded-br-none"
      : "bg-[#EFF4FB] text-black rounded-tl-none",
  );

  return (
    <div className="flex flex-col">
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
        <p className="ps-2 text-[12px] font-normal">{time}</p>
      </div>
    </div>
  );
};

export default MessageBox;
