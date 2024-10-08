"use client";
import { Drawer } from "@mui/material";
import React, { useState } from "react";
import { RxCrossCircled } from "react-icons/rx";
import { AiOutlineDelete } from "react-icons/ai"; // Import delete icon
import Button from "@/components/common/Button"; // Assuming you have a common Button component
import { ImSpinner2 } from "react-icons/im"; // Import a spinner icon for loading
import { FaCheckCircle } from "react-icons/fa";
import { useDirection } from "@/context/DirectionContext";
import ModalHeader from "../common/ModalHeader";
import MessageBox from "../Message/MessageBox";
import Message from "../Message";
import WriteMessage from "../Message/WriteMessage";

interface UserDrawerProps {
  toggleDrawer: any;
  isDrawerOpen: boolean;
}

const MessageDrawer = ({ isDrawerOpen, toggleDrawer }: UserDrawerProps) => {
  const { direction } = useDirection();
  const handleCloseDrawer = () => {
    toggleDrawer(false);
  };

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
        <div>
          <ModalHeader text="Messages" toggleDrawer={toggleDrawer} />
          <div>
            <Message />
          </div>
          <WriteMessage />
        </div>
      </div>
    </Drawer>
  );
};

export default MessageDrawer;
