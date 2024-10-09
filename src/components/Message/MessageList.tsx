import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store"; // Ensure the correct path

const MessageList = ({
  onSelectUser,
}: {
  onSelectUser: (userId: string) => void;
}) => {
  const users = useSelector((state: RootState) => state.message.users);

  return (
    <div className="user-list mx-2 mt-5 space-y-2">
      {users.map((user) => (
        <div
          className="flex cursor-pointer gap-3 rounded-md border border-red px-3 py-4 hover:bg-slate-300"
          key={user.userId}
          onClick={() => onSelectUser(user.userId)}
        >
          <img
            src="https://placehold.jp/150x150.png"
            alt="profile"
            className="h-7 w-7 rounded-full"
          />
          <div>
            <p className="text-[13px] font-semibold">{user.userName}</p>
            <p className="text-[13px] font-semibold">last message</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
