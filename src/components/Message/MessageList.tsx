import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { FaComments } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

export interface Message {
  role: "sender" | "receiver";
  message: string;
  time: string;
}

export interface UserChat {
  userId: string;
  userName: string;
  messages: Message[];
}

const MessageList = ({
  onSelectUser,
}: {
  onSelectUser: (user: any) => void;
}) => {
  const users = useSelector((state: RootState) => state.message.users);

  return (
    <>
      <h1 className="mx-5 mt-4 flex items-center text-xl font-bold">
        <FaComments className="mr-2 text-blue-500" /> All Messages (
        {users.length})
      </h1>
      <div className="user-list mt-4 max-h-[calc(100vh-150px)] space-y-2 overflow-y-scroll px-4 pb-5">
        {users.map((user) => (
          <div
            className="flex cursor-pointer justify-between rounded-lg border border-transparent bg-gradient-to-r from-white px-4 py-3 shadow-md transition duration-300 ease-in-out hover:from-blue-50 hover:from-purple-500 hover:to-blue-500 hover:text-white hover:shadow-lg hover:transition-all"
            key={user.userId}
            onClick={() => onSelectUser(user)}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={user.profileImage}
                  alt="profile"
                  className="border-gray-300 h-12 w-12 rounded-full border-2 object-cover"
                />
                <span
                  className={twMerge(
                    "absolute bottom-1 right-0 h-2.5 w-2.5 rounded-full border border-black transition duration-300 ease-in-out hover:border-white",
                    user?.isActive ? "bg-green-500" : "bg-[#515B6A]",
                  )}
                ></span>
              </div>
              <div className="space-y-1">
                <p className="text-gray-900 text-[14px] font-semibold">
                  {user?.userName}
                </p>
                <p className="text-gray-600 text-[12px] leading-[10px]">
                  {user?.messages[user?.messages?.length - 1]?.message?.slice(
                    0,
                    20,
                  ) || "No messages yet"}
                </p>
              </div>
            </div>
            <div className="flex items-end">
              <p className="text-gray-500 text-[10px]">
                {user?.messages[user?.messages?.length - 1]?.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MessageList;
