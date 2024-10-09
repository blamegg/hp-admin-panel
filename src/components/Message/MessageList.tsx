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
      <h1 className="mx-5 mt-4 flex items-center text-2xl font-bold">
        <FaComments className="mr-2 text-blue-500" /> All Messages (
        {users.length})
      </h1>
      <div className="user-list mx-4 mt-6 space-y-4">
        {users.map((user) => (
          <div
            className="to-gray-50 hover:border-gradient-to-r flex cursor-pointer justify-between rounded-xl border border-transparent bg-gradient-to-r from-white px-5 py-4 shadow-md transition duration-500 ease-in-out hover:from-blue-50 hover:from-purple-500 hover:to-blue-500 hover:text-white hover:shadow-lg hover:transition-all"
            key={user.userId}
            onClick={() => onSelectUser(user)}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={user.profileImage}
                  alt="profile"
                  className="border-gray-300 h-16 w-16 rounded-full border-2 object-cover"
                />
                <span
                  className={twMerge(
                    "absolute bottom-2 right-0 h-3 w-3 rounded-full border-2 border-black  transition duration-300 ease-in-out hover:border-white",
                    user?.isActive ? "bg-green-500" : "bg-[#515B6A]",
                  )}
                ></span>
              </div>
              <div className="space-y-1">
                <p className="text-gray-900 text-[16px] font-semibold">
                  {user?.userName}
                </p>
                <p className="text-gray-600 line-clamp-1 text-[14px]">
                  {user?.messages[user?.messages?.length - 1]?.message ||
                    "No messages yet"}
                </p>
              </div>
            </div>
            <div className="flex items-end">
              <p className="text-gray-500 text-[12px]">
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
