import React from "react";

interface MessageHeaderProps {
  setSelectedUserId: any;
}

const MessageHeader = ({ setSelectedUserId }: MessageHeaderProps) => {
  return (
    <div className="flex gap-2 border-b px-4 py-2">
      <button onClick={() => setSelectedUserId(null)}>back</button>
      <p>User Name</p>
    </div>
  );
};

export default MessageHeader;
