import React, { useState } from "react";
import { Drawer } from "@mui/material";
import { CurrentRoleDataInterFace } from "@/utility/queryFetcher";
import ModalHeader from "../common/ModalHeader";
import { AiOutlineDelete } from "react-icons/ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteRoleFn } from "@/utility/queryFetcher";
import { ImSpinner2 } from "react-icons/im";
import { FaCheckCircle } from "react-icons/fa";
import Button from "../common/Button";

interface DeleteRoleProps {
  isDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
  onDelete: (id: string) => void;
  selectedRole: CurrentRoleDataInterFace | null;
  setSelectedRole :any;
  direction: string
  fetchRoles: ()=> void;

}

const DeleteRole: React.FC<DeleteRoleProps> = ({
  isDrawerOpen,
  toggleDrawer,
  selectedRole,
  setSelectedRole,
  direction,
  fetchRoles

}) => {

  const [deleteRoleName, setDeleteRoleName] = useState<string>('')
  const queryClient = useQueryClient();

  const deleteRoleMn = useMutation({
    mutationFn: (roleId: string) => deleteRoleFn(roleId),
    onSuccess: () => {
      toast.success(`The role ${deleteRoleName} has been successfully deleted.`);
      queryClient.refetchQueries({ queryKey: ["roles"] });
      toggleDrawer(false);
      setSelectedRole(null);
      setDeleteRoleName('');
      fetchRoles();
      deleteRoleMn.reset();
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
      setDeleteRoleName(selectedRole.name);
      deleteRoleMn.mutate(selectedRole._id);
    }
  };

  const handleClose = () => {
    toggleDrawer(false);
    setSelectedRole(null);
    setDeleteRoleName('');
    deleteRoleMn.reset();
  };

  return (
    <Drawer
      anchor={direction === "ltr" ? "right" : "left"}
      open={isDrawerOpen}
      onClose={handleClose}
      disableEnforceFocus
      PaperProps={{
        sx: {
          width: "30%",
        },
      }}
    >

      <div role="presentation">
        <ModalHeader text="Delete Confirmation" toggleDrawer={handleClose} />
        <div className="relative  flex flex-col items-center justify-center px-7 pb-7 h-[calc(100vh-60px)] ">
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
                The role {deleteRoleName} has been successfully deleted.
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
              
              <div className='flex justify-end items-center gap-2 absolute bottom-0 h-[60px] w-full pr-8 border-t-2 border-gray'>
                <Button type="button" name="Close" className="mr-4 bg-graydark"  onClick={handleClose} />
                <Button
                  type="button"
                  name="Confirm"
                  onClick={handleDelete}
                  className="bg-danger"
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
