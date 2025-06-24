import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import CloseIcon from '@mui/icons-material/Close';
import { CurrentRoleDataInterFace } from "@/utility/queryFetcher";
import Button from "../common/Button";
import ModalHeader from "../common/ModalHeader";

interface ViewRoleDrawerProps {
  direction: "ltr" | "rtl";
  isDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
  selectedRole: CurrentRoleDataInterFace | null;
}

const ViewRoleDrawer: React.FC<ViewRoleDrawerProps> = ({
  direction,
  isDrawerOpen,
  toggleDrawer,
  selectedRole,
}) => {

  return (
    <Drawer
      anchor={direction === "ltr" ? "right" : "left"}
      open={isDrawerOpen}
      onClose={() => toggleDrawer(false)}
    >
      <div role="presentation" className="w-[300px]">
        <ModalHeader text={"Role details"} toggleDrawer={toggleDrawer} />
        <div className="pl-4 overflow-auto h-[510px]" >
          <p className="mt-5 mb-2">
            <strong className="text-[16px]">Role Name:</strong> <span className="text-green-500 text-[16px]"> {selectedRole?.name}</span>
          </p>
          <strong className="text-[16px]">Assigned Permissions</strong>
          {selectedRole?.menus && selectedRole.menus.length > 0 ? (
            <div className="ml-2 mt-1">
              {selectedRole?.menus?.map((permission: any) => (
                <ul className="list-disc ml-5">
                  <li>
                    <h2 className="font-semibold text-[14px]"> {permission.name}</h2>
                    <ul>
                      {permission?.sub_menus?.map((sub_permissions: any, index: string) => (
                        <li className="ms-2 text-[13px]"><span className="me-1">{index + 1}.</span>{sub_permissions.name}</li>
                      ))}
                    </ul>
                  </li>
                </ul>
              ))}
            </div>
          )
            : <div>
              <p className="my-3"> No Permission Assigned</p>
            </div>
          }
        </div>
        <div className='flex justify-end items-center gap-2 absolute bottom-0 h-[60px] w-full pr-4 border-t-2 border-gray'>
          <Button type="button" name="Close" className="mr-4 bg-graydark"  onClick={() => toggleDrawer(false)} />
        </div>
      </div>

    </Drawer>
  );
};

export default ViewRoleDrawer; 