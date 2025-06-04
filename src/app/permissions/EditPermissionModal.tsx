'use client'
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@mui/material';
import { menuListFn } from '@/utility/queryFetcher';

interface Permission {
  _id: string;
  name: string;
  menuId?: string; // Add menuId
  subMenuId?: string | null; // Add subMenuId
  isActive?: boolean; // Add isActive
}

interface EditPermissionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, menuId: string, subMenuId: string | null, isActive: boolean, id: string) => void;
  currentPermission: Permission | null;
}

interface Menu {
  _id: string;
  name: string;
  subMenus: SubMenu[];
}

interface SubMenu {
  _id: string;
  name: string;
}

const EditPermissionModal: React.FC<EditPermissionModalProps> = ({
  open,
  onClose,
  onSave,
  currentPermission,
}) => {
  const [permissionName, setPermissionName] = useState('');
  const [selectedMenu, setSelectedMenu] = useState<string>('');
  const [selectedSubMenu, setSelectedSubMenu] = useState<string>('');
  const [isActive, setIsActive] = useState(true);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [subMenus, setSubMenus] = useState<SubMenu[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && currentPermission) {
      setPermissionName(currentPermission.name);
      setSelectedMenu(currentPermission.menuId || '');
      setSelectedSubMenu(currentPermission.subMenuId || '');
      setIsActive(currentPermission.isActive ?? true); // Default to true if undefined
      setError(null);
      const fetchMenus = async () => {
        try {
          const data = await menuListFn();
          setMenus(data);
        } catch (err) {
          console.error('Failed to fetch menus:', err);
        }
      };
      fetchMenus();
    } else if (!open) {
      setPermissionName('');
      setSelectedMenu('');
      setSelectedSubMenu('');
      setIsActive(true);
      setError(null);
    }
  }, [open, currentPermission]);

  useEffect(() => {
    if (selectedMenu) {
      const menu = menus.find((m) => m._id === selectedMenu);
      setSubMenus(menu ? menu.subMenus : []);
      // Only reset submenu if the current one is not valid for the new menu
      if (currentPermission && menu && !menu.subMenus.some(sm => sm._id === currentPermission.subMenuId)) {
        setSelectedSubMenu('');
      } else if (!currentPermission) {
        setSelectedSubMenu('');
      }
    } else {
      setSubMenus([]);
      setSelectedSubMenu('');
    }
  }, [selectedMenu, menus, currentPermission]);

  const handleSave = () => {
    if (permissionName.trim() === '') {
      setError('Permission name is required');
      return;
    }
    if (!selectedMenu) {
      setError('Menu selection is required');
      return;
    }

    if (currentPermission) {
      onSave(permissionName, selectedMenu, selectedSubMenu || null, isActive, currentPermission._id);
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
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
          <InputLabel>Menu</InputLabel>
          <Select
            value={selectedMenu}
            label="Menu"
            onChange={(e) => {
              setSelectedMenu(e.target.value as string);
              setError(null);
            }}
            error={!!error && !selectedMenu}
          >
            {menus.map((menu) => (
              <MenuItem key={menu._id} value={menu._id}>
                {menu.name}
              </MenuItem>
            ))}
          </Select>
          {!!error && !selectedMenu && <Typography color="error" variant="caption">{error}</Typography>}
        </FormControl>

        <FormControl fullWidth margin="dense" sx={{ mb: 2 }} disabled={!selectedMenu || subMenus.length === 0}>
          <InputLabel>Submenu (Optional)</InputLabel>
          <Select
            value={selectedSubMenu}
            label="Submenu (Optional)"
            onChange={(e) => setSelectedSubMenu(e.target.value as string)}
          >
            <MenuItem value="">None</MenuItem>
            {subMenus.map((subMenu) => (
              <MenuItem key={subMenu._id} value={subMenu._id}>
                {subMenu.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              color="primary"
            />
          }
          label="Is Active"
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