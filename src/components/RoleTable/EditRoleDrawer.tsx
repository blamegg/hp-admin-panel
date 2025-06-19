import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import { CurrentRoleDataInterFace, menuDataInterface, RolesInterFace2, updateRoleAndRankFn } from "@/utility/queryFetcher";
import ModalHeader from "../common/ModalHeader";
import Permissions from "./PermissionDrawer";
import { Box, } from "@mui/system";
import Input from "../common/Input";
import Button from "../common/Button";
import { Tooltip } from "@mui/material";
import { HiInformationCircle } from "react-icons/hi";
import { toast } from "sonner";
import Select from "../common/Select";

interface EditRoleDrawerProps {
  direction: "ltr" | "rtl";
  isDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
  selectedRole: CurrentRoleDataInterFace | null;
  permissionsMenuList: RolesInterFace2 | null;
  fetchRoles: () => void;
}

const EditRole: React.FC<EditRoleDrawerProps> = ({
  direction,
  isDrawerOpen,
  toggleDrawer,
  selectedRole,
  permissionsMenuList,
  fetchRoles
}) => {
  const [roleName, setRoleName] = useState<string>('');
  const [rank, setRank] = useState<string>('');

  useEffect(() => {
    if (selectedRole) {
      setRoleName(selectedRole.name);
      setRank(selectedRole.rank);
    } else {
      setRoleName("");
      setRank("");
    }
  }, [selectedRole, isDrawerOpen]);

  const handleSave = async () => {
    if (!selectedRole) {
      console.error('selectedRole is null or undefined.');
      return;
    }
    try {
      await updateRoleAndRankFn({ name: roleName, rank: rank }, selectedRole._id);
      fetchRoles();
      if (typeof window !== 'undefined') {
        toast.success("Role updated successfully");
      }
      toggleDrawer(false);
    } catch (err: any) {
      console.error('Failed to edit role:', err);
      if (typeof window !== 'undefined') {
        toast.error(err?.response?.data?.message || "Failed to edit role");
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
        <div className="flex flex-wrap gap-4 items-center px-3 mt-4 mb-3">
          <div className=" flex flex-wrap justify-between md:justify-normal items-center gap-3 md:w-[50%] ">
            <div className="w-full md:w-auto ">
              <label htmlFor="role-name" className=" md:hidden block text-sm font-medium text-black dark:text-white">Role</label>
              <Input
                id="role-name"
                label=""
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Role Name"
                className="w-full md:w-auto"
              />
            </div>
            <div className="w-full md:w-auto ">
              <label htmlFor="rank" className="md:hidden w-full md:w-auto block text-sm font-medium text-black dark:text-white">Rank</label>
              <Select
                label=""
                options={Array.from({ length: 98 }, (_, i) => ({ value: String(i + 2), label: String(i + 2) }))}
                value={rank}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRank(e.target.value)}
              />
            </div>
            <div className="flex justify-end items-center md:flex-row-reverse md:justify-start gap-4 md:gap-1  w-full md:w-auto">
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
                enterTouchDelay={100}
                leaveTouchDelay={3000}
              >
                <button>
                  <HiInformationCircle className="size-7 text-blue-500 hover:text-blue-700 cursor-pointer" />
                </button>
              </Tooltip>
              <Button
                type="submit"
                name="Save"
                onClick={handleSave}
                className=" px-3 text-white rounded bg-success"
              />
            </div>
          </div>

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