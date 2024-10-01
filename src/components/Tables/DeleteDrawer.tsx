"use client";
import { Drawer } from "@mui/material";
import React from "react";
import { RxCrossCircled } from "react-icons/rx";
import { AiOutlineDelete } from "react-icons/ai"; // Import delete icon
import Button from "@/components/common/Button"; // Assuming you have a common Button component

interface UserDrawerProps {
  direction: string;
  toggleDrawer: any;
  isDrawerOpen: boolean;
  setDeleteDrawer: any;
  selected: any;
  setSelected: any;
}

const DeleteDrawer = ({
  direction,
  isDrawerOpen,
  toggleDrawer,
  setDeleteDrawer,
  setSelected,
  selected,
}: UserDrawerProps) => {
  const handleDelete = () => {
    // Add the logic for deleting a user here
    console.log("User deleted");
    // toggleDrawer(true);
    setDeleteDrawer(false);
  };

  return (
    <Drawer
      anchor={direction === "ltr" ? "right" : "left"}
      open={isDrawerOpen}
      disableEnforceFocus
      onClose={toggleDrawer(false)}
      PaperProps={{
        sx: {
          width: "25%", // Adjust width as needed
        },
      }}
    >
      <div role="presentation">
        <div className="flex items-center justify-between bg-companyRed p-4 text-white">
          <h2 className="text-xl font-bold">Delete Confirmation</h2>

          <RxCrossCircled
            className="cursor-pointer text-[30px] font-bold text-white hover:rounded-full"
            onClick={toggleDrawer(false)}
          />
        </div>

        <div className="mt-[50px] flex flex-col items-center justify-center px-7 pb-7">
          <div className="rounded-full border-[3px] border-red p-2">
            <AiOutlineDelete className="text-red-600 text-[50px]" />{" "}
          </div>
          {/* Delete Icon */}
          <h3 className="mt-4 text-center text-xl font-semibold">
            Are you sure you want to delete {selected?.name} user?
          </h3>
          <div className="mt-6 flex items-center gap-7">
            <Button
              type="button"
              name="Confirm Delete"
              className="bg-green-500"
              onClick={handleDelete}
            />
            <Button type="button" name="Cancel" onClick={toggleDrawer(false)} />
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default DeleteDrawer;
