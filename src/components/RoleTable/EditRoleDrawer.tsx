import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { CurrentRoleDataInterFace, RolesInterFace2 } from "@/utility/queryFetcher";
import ModalHeader from "../common/ModalHeader";
import Permissions from "./PermissionDrawer";
import { Typography } from "@mui/material";

interface EditRoleDrawerProps {
  direction: "ltr" | "rtl";
  isDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
  onSave: (role: string) => Promise<boolean>;
  currentRole: CurrentRoleDataInterFace | null;
  permissionsList: RolesInterFace2 | null;
}

const EditRole: React.FC<EditRoleDrawerProps> = ({
  direction,
  isDrawerOpen,
  toggleDrawer,
  onSave,
  currentRole,
  permissionsMenuList
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

    >
      <div className="w-[1000px]">
        <ModalHeader text={"Edit Role"} toggleDrawer={toggleDrawer} />
        <div className="px-3 mt-3 flex justify-between items-center gap-6 w-[40%]">
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
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </div>
        <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 600, fontSize: "22px" }}>
          Assign Permissions
        </Typography>
        <Permissions
          permissionsMenuList={permissionsMenuList}
        />
        <div className="flex justify-end items-center gap-3 absolute bottom-0 h-[70px] w-[100%] pr-4 border-t-2 border-gray ">
          <Button onClick={() => toggleDrawer(false)} sx={{ mr: 1 }}>
            Cancel
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default EditRole; 