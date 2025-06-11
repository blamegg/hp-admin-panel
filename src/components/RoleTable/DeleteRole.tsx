import React from "react";
import { Drawer, Box, Typography } from "@mui/material";
import { CurrentRoleDataInterFace } from "@/utility/queryFetcher";
import Button from "../common/Button";
import ModalHeader from "../common/ModalHeader";
import { AiOutlineDelete } from "react-icons/ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteRoleFn } from "@/utility/queryFetcher";
import { ImSpinner2 } from "react-icons/im";
import { FaCheckCircle } from "react-icons/fa";

interface DeleteRoleProps {
  isDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
  onDelete: (id: string) => void;
  selectedRole: CurrentRoleDataInterFace | null;
  direction: string
  fetchRoles: ()=> void;

}

const DeleteRole: React.FC<DeleteRoleProps> = ({
  isDrawerOpen,
  toggleDrawer,
  selectedRole,
  direction,
  fetchRoles

}) => {
  const queryClient = useQueryClient();

  const deleteRoleMn = useMutation({
    mutationFn: (roleId: string) => deleteRoleFn(roleId),
    onSuccess: () => {
      toast.success("Role deleted successfully");
      queryClient.refetchQueries({ queryKey: ["roles"] });
      toggleDrawer(false);
      fetchRoles()
    },
    onError: (error: any) => {
      let errorMessage = error?.response?.data?.message;
      if (typeof errorMessage !== "string") {
        errorMessage = "unknown error";
      }
      toast.error(errorMessage);
    },
  });

  const handleDelete = () => {
    if (selectedRole) {
      deleteRoleMn.mutate(selectedRole._id);
    }
  };

  return (
    <Drawer
      anchor={direction === "ltr" ? "right" : "left"}
      open={isDrawerOpen}
      onClose={() => {
        toggleDrawer(false);
        deleteRoleMn.reset();
      }}
      disableEnforceFocus
      PaperProps={{
        sx: {
          width: "26%",
        },
      }}
    >

      <div role="presentation">
        <ModalHeader text="Delete Confirmation" toggleDrawer={toggleDrawer} />
        <div className="relative  flex flex-col items-center justify-center px-7 pb-7 h-[570px]">
          {deleteRoleMn.isPending && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-75">
              <ImSpinner2 className="animate-spin text-5xl text-companyRed" />
              <h3 className="mt-3 text-lg font-semibold text-companyRed">
                Loading...
              </h3>
            </div>
          )}

          {deleteRoleMn.isSuccess ? (
            <>
              <div className="rounded-full bg-[#FCFCFC] p-2">
                <FaCheckCircle className="text-[50px] text-green-600" />{" "}
              </div>
              <h2 className="mt-2 text-xl font-semibold">Role Deleted!</h2>
              <h3 className="mt-2 text-center text-[18px] font-semibold text-[#8D8D8D]">
                The role {selectedRole?.name} has been successfully deleted.
              </h3>
            </>
          ) : (
            <>
              <div className="rounded-full border-[3px] border-black bg-[#FCFCFC] p-2 ">
                <AiOutlineDelete className="text-red-600 text-[50px] text-companyRed" />{" "}
              </div>
              <h2 className="mt-2 text-xl font-semibold">
                You are about to delete a role
              </h2>
              <h3 className="mt-2 text-center text-[18px] font-semibold text-[#8D8D8D]">
                Are you sure you want to delete {selectedRole?.name} role?
              </h3>
              <div className="mt-6 flex w-full items-center justify-end pr-3 gap-7 absolute bottom-0 border-t-2 border-gray h-[50px]">
                <Button
                  type="button"
                  name="Confirm"
                  onClick={handleDelete}
                  style={{backgroundColor:"#ff505d"}}
                />
                <Button
                  type="button"
                  name="Cancel"
                  onClick={() => toggleDrawer(false)}
                  style={{ backgroundColor: "gray" }}
                />
              </div>
            </>
          )}
        </div>
      </div>
   
    </Drawer>
  );
};

export default DeleteRole;
