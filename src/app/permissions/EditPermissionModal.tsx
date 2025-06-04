'use client'
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

interface Permission {
  _id: string;
  name: string;
}

interface EditPermissionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, id: string) => void;
  currentPermission: Permission | null;
}

const EditPermissionModal: React.FC<EditPermissionModalProps> = ({
  open,
  onClose,
  onSave,
  currentPermission,
}) => {
  const [permissionName, setPermissionName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && currentPermission) {
      setPermissionName(currentPermission.name);
      setError(null);
    } else if (!open) {
      setPermissionName(''); // Clear on close
      setError(null);
    }
  }, [open, currentPermission]);

  const handleSave = () => {
    if (permissionName.trim() === '') {
      setError('Permission name is required');
      return;
    }
    if (currentPermission) {
      onSave(permissionName, currentPermission._id);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Permission</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Permission Name"
          type="text"
          fullWidth
          value={permissionName}
          onChange={(e) => {
            setPermissionName(e.target.value);
            setError(null);
          }}
          error={!!error}
          helperText={error}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPermissionModal; 