import React from "react";
import { useSelector } from "react-redux";
import MessageBox, { MessageBoxProps } from "./MessageBox";

const Message = () => {
  // Get the messages from the Redux store
  const initialMessage = useSelector(
    (state: any) => state?.message?.initialMessage,
  );

  return (
    <div className="space-y-1 px-3 py-5">
      {initialMessage.map((msg: MessageBoxProps, index: number) => (
        <MessageBox key={index} role={msg.role} time={msg.time}>
          {msg.message}
        </MessageBox>
      ))}
    </div>
  );
};

export default Message;
