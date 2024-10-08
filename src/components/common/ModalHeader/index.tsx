"use client";
import { RootState } from "@/redux/store";
import React from "react";
import { RxCrossCircled } from "react-icons/rx";
import { useSelector } from "react-redux";

interface ModalHeaderProps {
  toggleDrawer: any;
  text: string;
}

const ModalHeader = ({ toggleDrawer, text }: ModalHeaderProps) => {
  const color = useSelector((state: RootState) => state?.app?.color);

  return (
    <div
      className="flex items-center justify-between p-4 text-white"
      style={{
        background: color,
      }}
    >
      <h2 className="text-xl font-bold">{text}</h2>
      <RxCrossCircled
        className="cursor-pointer text-[30px] font-bold text-white hover:rounded-full"
        onClick={() => toggleDrawer(false)}
      />
    </div>
  );
};

export default ModalHeader;
