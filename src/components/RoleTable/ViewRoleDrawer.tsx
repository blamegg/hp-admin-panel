import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import CloseIcon from '@mui/icons-material/Close';
import { CurrentRoleDataInterFace} from "@/utility/queryFetcher";
import Button from "../common/Button";

interface ViewRoleDrawerProps {
  direction: "ltr" | "rtl";
  isDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
  selectedRole: CurrentRoleDataInterFace | null;
  togglePermissionDrawer:(open:boolean, role:CurrentRoleDataInterFace | null)=> void;
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
        <div className="flex justify-between items-center mb-2">
          <Typography variant="h5" sx={{fontWeight:600}}>
            Role Details
          </Typography>
          <button className="bg-graydark" onClick={()=> toggleDrawer(false)}>
            <CloseIcon />
          </button>
        </div>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Role Name:</strong> <span className="text-green-500"> {selectedRole?.name}</span>
        </Typography>
        <h1 className="font-bold text-lg">Assigned Permissions</h1>
        {selectedRole?.menus && selectedRole.menus.length > 0 ? (
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
              <Button type="button" name="Update Permissions" onClick={handleUpdatePermissions}></Button>
            </div>
          </>
              ) 
           : <div>
            <p className="my-3"> No Permission Assigned</p>
            <Button type="button" name="Provide Permissions"  onClick={handleUpdatePermissions}></Button>
          </div>
        }

      </Box>
    </Drawer>
  );
};

export default ViewRoleDrawer; 