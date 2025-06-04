import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface AddRoleModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (role: string, permissions: string[]) => void;
  permissionsList: { _id: string; name: string }[];
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};

export default function AddRoleModal({ open, onClose, onSave, permissionsList }: AddRoleModalProps) {
  const [roleName, setRoleName] = React.useState<string>('');
  const [selectedPermissions, setSelectedPermissions] = React.useState<string[]>([]);

  const handleSave = () => {
    onSave(roleName, selectedPermissions);
    setRoleName('');
    setSelectedPermissions([]);
    onClose();
  };

  console.log(permissionsList)

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-role-modal-title"
      aria-describedby="add-role-modal-description"
    >
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="add-role-modal-title" variant="h6" component="h2">
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
          sx={{ mt: 2 }}
        />
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="permissions-select-label">Permissions</InputLabel>
          <Select
            labelId="permissions-select-label"
            id="permissions-select"
            multiple
            value={selectedPermissions}
            onChange={(event) => {
              const { target: { value } } = event;
              setSelectedPermissions(
                typeof value === 'string' ? value.split(', ') : value,
              );
            }}
            label="Permissions"
            renderValue={(selected) => (selected as string[]).join(', ')}
          >
            {permissionsList?.data?.map((permission) => (
              <MenuItem key={permission._id} value={permission.name}>
                {permission.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained" sx={{ ml: 2 }}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
} 