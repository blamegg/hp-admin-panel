import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";

import Button from "../common/Button";
import { createRoleFn, CurrentRoleDataInterFace, RolesInterFace2 } from "@/utility/queryFetcher";
import { toast } from "sonner";
import ModalHeader from "../common/ModalHeader";
import { SelectChangeEvent } from '@mui/material/Select';

import Input from "../common/Input";

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
  const [roleRank, setRoleRank] = useState<number>(2);

  useEffect(() => {
    if (!isDrawerOpen) {
      setRoleName("");
      setRoleRank(2);
    }
  }, [isDrawerOpen]);


  const handleCreateRole = async (): Promise<boolean> => {
    try {
      const currentRoleData = await createRoleFn({ name: roleName, rank: roleRank });
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

  const handleRankChange = (event: SelectChangeEvent<number>) => {
    setRoleRank(Number(event.target.value));
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
          <Input
            autoFocus={true}
            id="role-name"
            label="Role Name"
            type="text"
            placeholder="Role Name"
            value={roleName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoleName(e.target.value)}
          />


          <div className="mt-2">
            <label htmlFor="role-rank" className="block text-sm font-medium text-black dark:text-white">Rank</label>
            <select
              labelId="role-rank-label"
              id="role-rank"
              value={roleRank}
              onChange={handleRankChange}
              className="rounded bg-[#eff4fb] focus:border-primary focus-visible:outline-none px-2 py-[4px] outline-none w-full"
            >
              {Array.from({ length: 99 }, (_, i) => i + 2).map((rank) => (
                <option key={rank} value={rank}>
                  {rank}
                </option>
              ))}
            </select>
          </div>

        </div>
        <div className="flex justify-end items-center gap-3 absolute bottom-0 h-[70px] w-[100%] pr-2 border-t-2 border-gray">
          <Button type="button" name="Cancel" onClick={() => toggleDrawer(false)} >
          </Button>
          <Button type="submit" name=" Create Role" onClick={handleCreateRole}></Button>
        </div>
      </div>
    </Drawer>
  );
};

export default CreateRole; 