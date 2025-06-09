import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "../common/Button";
import { createRoleFn, CurrentRoleDataInterFace, RolesInterFace2 } from "@/utility/queryFetcher";
import { toast } from "sonner";
import ModalHeader from "../common/ModalHeader";

interface AddRoleDrawerProps {
  direction: "ltr" | "rtl";
  isDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
  fetchRoles: () => void;
  togglePermissionDrawer: (open: boolean, role?: CurrentRoleDataInterFace | RolesInterFace2 | null) => void;
}

const CreateRole: React.FC<AddRoleDrawerProps> = ({
  direction,
  isDrawerOpen,
  toggleDrawer,
  fetchRoles,
  togglePermissionDrawer
}) => {
  const [roleName, setRoleName] = useState<string>("");

  useEffect(() => {
    if (!isDrawerOpen) {
      setRoleName("");
    }
  }, [isDrawerOpen]);


  const handleCreateRole = async (role: string): Promise<boolean> => {
    console.log("click fucntion")
    try {
      const currentRoleData = await createRoleFn({ name: role });
      fetchRoles();
      toast.success("New Role created successfully");
      toggleDrawer(false)
      togglePermissionDrawer(true, currentRoleData);
      return true;
    } catch (err: any) {
      console.error('Failed to add role:', err);
      toast.error(err.response.data.message)
      return false;
    }
  };

  return (
    <Drawer
      anchor={direction === "ltr" ? "right" : "left"}
      open={isDrawerOpen}
      onClose={() => toggleDrawer(false)}
    >
      <div className="w-[350px] ">
        <ModalHeader text={"Create Role"} toggleDrawer={toggleDrawer} />
        <div className=" mx-3 mt-3">
          <TextField
            autoFocus
            margin="dense"
            id="role-name"
            label="Role Name"
            type="text"
            fullWidth
            variant="outlined"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            sx={{ mb: 2 }}
          />
        </div>
        <div className="flex justify-end items-center gap-3 absolute bottom-0 h-[70px] w-[100%] pr-2 border-t-2 border-gray">
          <Button type="button" name="Cancel" onClick={() => toggleDrawer(false)} >
          </Button>
          <Button type="submit" name=" Create Role" onClick={() => handleCreateRole(roleName)}></Button>
        </div>
      </div>
    </Drawer>
  );
};

export default CreateRole; 