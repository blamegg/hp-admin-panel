import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import { CurrentRoleDataInterFace, menuDataInterface, RolesInterFace2 } from "@/utility/queryFetcher";
import ModalHeader from "../common/ModalHeader";
import Permissions from "./PermissionDrawer";
import { Box,} from "@mui/system";
import Input from "../common/Input";
import Button from "../common/Button";

interface EditRoleDrawerProps {
  direction: "ltr" | "rtl";
  isDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
  onSave: (role: string) => Promise<boolean>;
  currentRole: CurrentRoleDataInterFace | null;
  permissionsMenuList: RolesInterFace2 | null;
  fetchRoles: () => void;
}

const EditRole: React.FC<EditRoleDrawerProps> = ({
  direction,
  isDrawerOpen,
  toggleDrawer,
  onSave,
  currentRole,
  permissionsMenuList,
  fetchRoles
}) => {
  const [roleName, setRoleName] = useState<string>("");

  useEffect(() => {
    if (currentRole) {
      setRoleName(currentRole.name);
    } else {
      setRoleName("");
    }
  }, [currentRole, isDrawerOpen]);

  const handleSave = async () => {
    if (currentRole) {
      const success = await onSave(roleName);
      if (success) {
        toggleDrawer(false);
      }
    }
  };


  return (
    <Drawer
      anchor={direction === "ltr" ? "right" : "left"}
      open={isDrawerOpen}
      onClose={() => toggleDrawer(false)}
       PaperProps={{
                sx: {
                    width: "70%",
                },
            }}
    >
      <div >
        <ModalHeader text={"Edit Role"} toggleDrawer={toggleDrawer} />
        <Box className="px-3 mt-4 mb-3 flex justify-between items-center gap-3 w-[40%] ">
          <Input
            autofocus
            id="role-name"
            label=""
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="Role Name"
            />
          <Button
            type="submit"
            name="Save"
            onClick={handleSave}
            style={{backgroundColor:"#00b300"}}
            className=" px-3 text-white rounded"
          />
        
        </Box>

        <p className="text-xl mb-2 ps-5 font-bold" >
          Assign Permissions
        </p>
        <Permissions
          permissionsMenuList={permissionsMenuList}
          currentRole={currentRole}
          toggleDrawer={toggleDrawer}
          fetchRoles={fetchRoles}
        />
      </div>
    </Drawer>
  );
};

export default EditRole; 
 EditRole; 