import React, { useState, ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { addMessage } from "@/redux/slice/MessageSlice";

const WriteMessage: React.FC = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      dispatch(
        addMessage({
          role: "sender",
          time: "1:55pm",
          message: message,
        }),
      );
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="bg-gray-100 flex items-center rounded-lg p-2">
      <input
        type="text"
        placeholder="Type something here"
        className="bg-gray-100 flex-grow rounded-lg border-none px-4 py-2 outline-none"
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
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
    </div>
  );
};

export default WriteMessage;
