import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { useDirection } from "@/context/DirectionContext";
import Drawer from "@mui/material/Drawer";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface AddRoleDrawerProps {
  direction: "ltr" | "rtl";
  isDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
  onSave: (role: string) => void;
}

const AddRoleDrawer: React.FC<AddRoleDrawerProps> = ({
  direction,
  isDrawerOpen,
  toggleDrawer,
  onSave,
}) => {
  const [roleName, setRoleName] = useState<string>("");

  useEffect(() => {
    if (!isDrawerOpen) {
      setRoleName("");
    }
  }, [isDrawerOpen]);

  const handleSave = async () => {
    const success = await onSave(roleName);
    if (success) {
      toggleDrawer(false);
    }
  };

  return (
    <Drawer
      anchor={direction === "ltr" ? "right" : "left"}
      open={isDrawerOpen}
      onClose={() => toggleDrawer(false)}
    >
      <Box sx={{ width: 350, padding: 2 }}>
        <Typography variant="h6" sx={{ marginBottom: 2, fontWeight:"600"}}>
          Add New Role
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
    
        <Box sx={{ display: "flex", justifyContent: "flex-end",gap:"10px", mt: 2 }}>
          <Button onClick={() => toggleDrawer(false)} sx={{background:"gray", color:"white"}}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: '#3b82f6', color: 'white' }}>
            Create Role
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AddRoleDrawer; 