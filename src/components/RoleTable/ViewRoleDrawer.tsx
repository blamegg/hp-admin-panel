import React from "react";
import Box from "@mui/material/Box";
import { useDirection } from "@/context/DirectionContext";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import { Data } from "./index";

interface ViewRoleDrawerProps {
  direction: "ltr" | "rtl";
  isDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
  selected: Data | null;
}

const ViewRoleDrawer: React.FC<ViewRoleDrawerProps> = ({
  direction,
  isDrawerOpen,
  toggleDrawer,
  selected,
}) => {
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
        {selected ? (
          <>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Role Name:</strong> {selected.name}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Permissions:</strong>
              {/* {selected.permissions.length > 0 ? (
                <ul>
                  {selected.permissions.map((p) => (
                    <li key={p._id}>{p.name}</li>
                  ))}
                </ul>
              ) : (
                "No permissions assigned."
              )} */}
            </Typography>
          </>
        ) : (
          <Typography>No role selected.</Typography>
        )}
      </Box>
    </Drawer>
  );
};

export default ViewRoleDrawer; 