import React from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { twMerge } from "tailwind-merge";

interface MessageHeaderProps {
  setSelectedUser: any;
  selectedUser: { profileImage: string; userName: string; isActive: boolean };
}

const MessageHeader = ({
  setSelectedUser,
  selectedUser,
}: MessageHeaderProps) => {
  const isOnline = true;

  return (
    <div className="flex items-center gap-2 bg-blue-500 py-2 ps-3 shadow-lg">
      <button
        onClick={() => setSelectedUser(null)}
        className="hover:text-gray-200 flex items-center gap-2 text-white transition-colors"
      >
        <IoChevronBackOutline
          size={24}
          className="hover:text-gray-300 transform transition-transform hover:scale-110"
        />
      </button>

      <div className="relative">
        <img
          src={selectedUser.profileImage}
          alt="user"
          className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-md"
        />
        <span
          className={twMerge(
            "absolute bottom-2 right-0 h-3 w-3 rounded-full border-2",
            selectedUser?.isActive
              ? "border-white bg-green-500"
              : "border-white bg-[#515B6A]",
          )}
        ></span>
      </div>

      <div>
        <p className="text-lg font-semibold text-white">
          {selectedUser?.userName}
        </p>
        <p className="text-[11px] font-semibold leading-[10px] text-white">
          {selectedUser?.isActive ? "Active now" : "Away"}
        </p>
      </div>
    </div>
  );
};

export default MessageHeader;
