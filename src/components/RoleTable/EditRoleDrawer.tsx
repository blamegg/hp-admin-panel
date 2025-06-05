import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Data } from "./index";

interface EditRoleDrawerProps {
  direction: "ltr" | "rtl";
  isDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
  onSave: (role: string) => Promise<boolean>;
  currentRole: Data | null;
  permissionsList: { _id: string; name: string }[];
}

const EditRoleDrawer: React.FC<EditRoleDrawerProps> = ({
  direction,
  isDrawerOpen,
  toggleDrawer,
  onSave,
  currentRole,
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
      <Box sx={{ width: 350, padding: 2 }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Edit Role
        </Typography>
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
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button onClick={() => toggleDrawer(false)} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default EditRoleDrawer; 