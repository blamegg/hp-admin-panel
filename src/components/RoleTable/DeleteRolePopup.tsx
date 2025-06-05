import React from "react";
import { Box, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Data } from "./index";
import { Delete } from "@mui/icons-material";

interface DeleteRolePopupProps {
  isDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
  onDelete: (id: string) => void;
  selected: Data | null;
}

const DeleteRolePopup: React.FC<DeleteRolePopupProps> = ({
  isDrawerOpen: isOpen,
  toggleDrawer: toggleOpen,
  onDelete,
  selected,
}) => {
  const handleDelete = () => {
    if (selected) {
      onDelete(selected._id);
      toggleOpen(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => toggleOpen(false)}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">
        {"Delete Role"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          Are you sure you want to delete the role "{selected?.name}"?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => toggleOpen(false)} sx={{ mr: 1, backgroundColor:"gray", color:"white" }}>
          Cancel
        </Button>
        <Button onClick={handleDelete} variant="contained" color="error">
          {/* <Delete /> */}
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteRolePopup; 