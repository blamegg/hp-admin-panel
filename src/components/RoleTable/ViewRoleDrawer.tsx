import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import { Data } from "./index";

interface ViewRoleDrawerProps {
  direction: "ltr" | "rtl";
  isDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
  selectedRole: Data;
}

const ViewRoleDrawer: React.FC<ViewRoleDrawerProps> = ({
  direction,
  isDrawerOpen,
  toggleDrawer,
  selectedRole,
  togglePermissionDrawer,
}) => {

  const handleUpdatePermissions = () => {
    togglePermissionDrawer(true, selectedRole)
    toggleDrawer(false);
  }

  return (
    <Drawer
      anchor={direction === "ltr" ? "right" : "left"}
      open={isDrawerOpen}
      onClose={() => toggleDrawer(false)}
    >
      <Box sx={{ width: 350, padding: 2 }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Role Details
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Role Name:</strong> {selectedRole?.name}
        </Typography>
        <h1 className="font-bold text-lg">Assigned Permissions</h1>
        {selectedRole?.menus?.length === 0 || undefined || null ? (
          <>
            <div>
              {selectedRole?.menus?.map((permission: any) => (
                <>
                  <h2 className="font-semibold"> {permission.name}</h2>
                  <ul>
                    {permission?.sub_menus?.map((sub_permissions: any, index: string) => (
                      <li className="ms-2"><span className="me-1">{index + 1}.</span>{sub_permissions.name}</li>
                    ))}
                  </ul>
                </>
              ))}
            </div>
            <div className="text-center my-2">
              <button className="bg-[#ff505d] px-2 py-1 mr-2 my-2 rounded-md text-white" onClick={handleUpdatePermissions}>Update Permissions</button>
            </div>
          </>)
          : <div>
            <p className="my-3"> No Permission Assigned</p>
            <button className="bg-[#ff505d] px-2 py-1 mr-2 my-2 rounded-md text-white" onClick={handleUpdatePermissions}>Provide Permissions</button>
          </div>
        }

      </Box>
    </Drawer>
  );
};

export default ViewRoleDrawer; 