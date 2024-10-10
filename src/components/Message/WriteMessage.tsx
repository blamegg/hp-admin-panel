import React, { useState, ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { addMessage } from "@/redux/slice/MessageSlice";
import EmojiPicker from "emoji-picker-react";
import { VscSmiley } from "react-icons/vsc";
import { twMerge } from "tailwind-merge";
import { SelectedUserProps } from "../BottomStrip/MessageDrawer";

interface WriteMessageProps {
  selectedUser: SelectedUserProps;
}

const WriteMessage = ({ selectedUser }: WriteMessageProps) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState<string>("");
  const [showEmoji, setShowEmoji] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      dispatch(
        addMessage({
          userId: selectedUser?.userId,
          message: {
            role: "sender",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            message: message,
          },
        }),
      );
      setShowEmoji(false);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const onEmojiClick = (emojiObject: any) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  return (
    <div className="bg-gray-100 absolute bottom-0 flex w-full items-center rounded-lg bg-white p-2">
      <input
        type="text"
        placeholder="Type something here"
        className="flex-grow rounded-lg border-none bg-[#EFF4FB] px-4 py-2 text-[14px] outline-none"
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <VscSmiley
        onClick={() => setShowEmoji((prev) => !prev)}
        className={twMerge(
          "ms-2 cursor-pointer",
          showEmoji ? "text-red" : "text-blue-900",
        )}
        size={25}
      />
      <button
        className="ml-2 rounded-lg bg-blue-500 p-2 text-white"
        onClick={handleSendMessage}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 21L20.25 12 3.75 3v7.5l11.25 1.5L3.75 13.5V21z"
          />
        </svg>
      </button>
      {showEmoji && (
        <div className="absolute bottom-15 left-2 z-10">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default WriteMessage;
