"use client";
import { Drawer } from "@mui/material";
import React, { useState } from "react";
import { RxCrossCircled } from "react-icons/rx";
import { AiOutlineDelete } from "react-icons/ai";
import Button from "@/components/common/Button";
import { ImSpinner2 } from "react-icons/im";
import { FaCheckCircle } from "react-icons/fa";
import ModalHeader from "../common/ModalHeader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserFn } from "@/utility/queryFetcher";

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
  const queryClient = useQueryClient();
  const deleteUserMn = useMutation({
    mutationFn: (userId: string) => deleteUserFn(userId),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["menu-list"] });
    },
  });

  const handleDelete = () => {
    deleteUserMn.mutate(selected._id);
  };

  return (
    <Drawer
      anchor={direction === "ltr" ? "right" : "left"}
      open={isDrawerOpen}
      onClose={() => {
        setDeleteDrawer(false);
        setSelected(null);
        deleteUserMn.reset();
      }}
      disableEnforceFocus
      PaperProps={{
        sx: {
          width: "25%",
        },
      }}
    >
      <div role="presentation">
        <ModalHeader text="Delete Confirmation" toggleDrawer={toggleDrawer} />

        <div className="relative mt-[50px] flex flex-col items-center justify-center px-7 pb-7">
          {deleteUserMn.isPending && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-75">
              <ImSpinner2 className="animate-spin text-5xl text-companyRed" />
              <h3 className="mt-3 text-lg font-semibold text-companyRed">
                Loading...
              </h3>
            </div>
          )}

          {deleteUserMn.isSuccess ? (
            <>
              <div className="rounded-full bg-[#FCFCFC] p-2">
                <FaCheckCircle className="text-[50px] text-green-600" />{" "}
              </div>
              <h2 className="mt-2 text-xl font-semibold">User Deleted!</h2>
              <h3 className="mt-2 text-center text-[18px] font-semibold text-[#8D8D8D]">
                The user {selected?.name} has been successfully deleted.
              </h3>
            </>
          ) : (
            <>
              <div className="rounded-full border-[3px] border-black bg-[#FCFCFC] p-2">
                <AiOutlineDelete className="text-red-600 text-[50px] text-companyRed" />{" "}
              </div>
              <h2 className="mt-2 text-xl font-semibold">
                You are about to delete a user
              </h2>
              <h3 className="mt-2 text-center text-[18px] font-semibold text-[#8D8D8D]">
                Are you sure you want to delete {selected?.name} user?
              </h3>
              <div className="mt-6 flex w-full items-center justify-center gap-7">
                <Button
                  type="button"
                  name="Confirm"
                  className="bg-green-500"
                  onClick={handleDelete}
                />
                <Button
                  type="button"
                  name="Cancel"
                  onClick={() => toggleDrawer(false)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default DeleteDrawer;
