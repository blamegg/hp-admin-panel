"use client";
import { Drawer } from "@mui/material";
import React, { useState } from "react";
import { useDirection } from "@/context/DirectionContext";
import ModalHeader from "../common/ModalHeader";
import WriteMessage from "../Message/WriteMessage";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import MessageList from "../Message/MessageList";
import MessageBox from "../Message/MessageBox";
import MessageHeader from "../Message/MessageHeader";

interface UserDrawerProps {
  toggleDrawer: any;
  isDrawerOpen: boolean;
}

const MessageDrawer = ({ isDrawerOpen, toggleDrawer }: UserDrawerProps) => {
  const { direction } = useDirection();
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const handleCloseDrawer = () => {
    toggleDrawer(false);
  };

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
  };

  const userMessages = useSelector(
    (state: RootState) =>
      state.message.users.find((user) => user.userId === selectedUser?.userId)
        ?.messages || [],
  );

  console.log(userMessages, "userMessages");

  return (
    <Drawer
      anchor={direction === "ltr" ? "right" : "left"}
      open={isDrawerOpen}
      onClose={handleCloseDrawer}
      disableEnforceFocus
      PaperProps={{
        sx: {
          width: "25%",
        },
      }}
    >
      <div role="presentation">
        <div className="relative h-[100vh] overflow-hidden border border-black">
          <ModalHeader text="Messages" toggleDrawer={toggleDrawer} />

          {!!!selectedUser && <MessageList onSelectUser={handleSelectUser} />}

          {!!selectedUser && (
            <MessageHeader
              setSelectedUser={setSelectedUser}
              selectedUser={selectedUser}
            />
          )}

          <div className="mt-5 max-h-[calc(100vh-108px)] overflow-y-scroll px-2">
            {selectedUser &&
              userMessages.map((msg, index) => (
                <MessageBox key={index} role={msg.role} time={msg.time}>
                  {msg.message}
                </MessageBox>
              ))}
          </div>

          {selectedUser && <WriteMessage selectedUser={selectedUser} />}
        </div>
      </div>
    </Drawer>
  );
};

export default MessageDrawer;
