import React from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { CurrentRoleDataInterFace } from "@/utility/queryFetcher";
import Button from "../common/Button";

interface DeleteRolePopupProps {
  isDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
  onDelete: (id: string) => void;
  selectedRole: CurrentRoleDataInterFace | null;
}

const DeleteRolePopup: React.FC<DeleteRolePopupProps> = ({
  isDrawerOpen: isOpen,
  toggleDrawer: toggleOpen,
  onDelete,
  selectedRole,
}) => {
  const handleDelete = () => {
    if (selectedRole) {
      onDelete(selectedRole._id);
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
          Are you sure you want to delete the role "{selectedRole?.name}"?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button type="button" name="Cancel" onClick={() => toggleOpen(false)}>
        </Button>
        <Button type="submit" name="Delete" onClick={handleDelete} >
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteRolePopup; 