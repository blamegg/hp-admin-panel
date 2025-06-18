import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import { CurrentRoleDataInterFace, menuDataInterface, RolesInterFace2 } from "@/utility/queryFetcher";
import ModalHeader from "../common/ModalHeader";
import Permissions from "./PermissionDrawer";
import { Box, } from "@mui/system";
import Input from "../common/Input";
import Button from "../common/Button";
import { Tooltip } from "@mui/material";
import { HiInformationCircle } from "react-icons/hi";

interface EditRoleDrawerProps {
  direction: "ltr" | "rtl";
  isDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
  onSave: (role: string) => Promise<boolean>;
  selectedRole: CurrentRoleDataInterFace | null;
  permissionsMenuList: RolesInterFace2 | null;
  fetchRoles: () => void;
}

const EditRole: React.FC<EditRoleDrawerProps> = ({
  direction,
  isDrawerOpen,
  toggleDrawer,
  onSave,
  selectedRole,
  permissionsMenuList,
  fetchRoles
}) => {
  const [roleName, setRoleName] = useState<string>("");

  useEffect(() => {
    if (selectedRole) {
      setRoleName(selectedRole.name);
    } else {
      setRoleName("");
    }
  }, [selectedRole, isDrawerOpen]);

  const handleSave = async () => {
    if (selectedRole) {
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
        <ModalHeader text={"Assign Permissions"} toggleDrawer={toggleDrawer} />
        <div className="flex gap-4 items-center px-3 mt-4 mb-3">
          <Box className=" flex justify-between items-center gap-3 w-[40%] ">
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
              className=" px-3 text-white rounded bg-success"
            />

          </Box>
          <Tooltip 
            title={
              <div>
                <h3 className="text-sm font-semibold mb-2">📋 How to reorder permissions:</h3>
                <ul className="text-xs  space-y-1">
                  <li>• Drag the grip handle (⋮⋮) next to main permissions to reorder them</li>
                  <li>• Drag the small grip handle (⋮⋮) next to sub-permissions to reorder them within their parent</li>
                  <li>• The new order will be saved when you click "Update"</li>
                  <li>• Use "Reset Order" to restore the default order</li>
                </ul>
              </div>
            }
            placement="top"
            arrow
            PopperProps={{
              sx: {
                zIndex: 9999,
                '& .MuiTooltip-tooltip': {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  fontSize: '12px',
                  backgroundColor: "gray",
                  maxWidth: '400px',
                },
                '& .MuiTooltip-arrow': {
                  color: 'white',
                }
              }
            }}
          >
            <button>
            <HiInformationCircle className="size-7 text-blue-500 hover:text-blue-700 cursor-pointer" />
            </button>
          </Tooltip>
      
        </div>
        <Permissions
          permissionsMenuList={permissionsMenuList}
          currentRole={selectedRole}
          toggleDrawer={toggleDrawer}
          fetchRoles={fetchRoles}
        />
      </div>
    </Drawer>
  );
};

export default EditRole;
EditRole; 