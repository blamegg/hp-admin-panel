import { updatePermissionFn } from '@/utility/queryFetcher';
import { Drawer, Box, Typography, Button, FormControl } from '@mui/material'
import React from 'react'
import { toast } from 'sonner';
import { RoleInterFace} from '@/utility/queryFetcher';

interface PermissionDrawerProps {
  isDrawerOpen: boolean;
  toggleDrawer: (open: boolean, role?: RoleInterFace) => void;
  permissionsMenuList: MenuListResponse;
  role?: RoleInterFace | null;
  fetchRoles: () => void;
}

const PermissionDrawer: React.FC<PermissionDrawerProps> = ({
  isDrawerOpen,
  toggleDrawer,
  permissionsMenuList,
  role,
  fetchRoles
}) => {
  const [selectedPermissions, setSelectedPermissions] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (role?.menus) {
      const initialPermissions: string[] = [];

      role.menus.forEach(menu => {
        initialPermissions.push(menu.menu_id);
        menu?.sub_menus?.forEach(sub => {
          initialPermissions.push(sub.menu_id);
        });
      });

      setSelectedPermissions(initialPermissions);
    }
  }, [role]);


  const handleMainMenuChange = (e: React.ChangeEvent<HTMLInputElement>, permission: any) => {
    const isChecked = e.target.checked;
    let newSelectedPermissions = [...selectedPermissions];

    if (isChecked) {
      newSelectedPermissions.push(permission._id);
      permission.subMenus.forEach((subMenu: any) => {
        if (!newSelectedPermissions.includes(subMenu._id)) {
          newSelectedPermissions.push(subMenu._id);
        }
      });
    } else {
      newSelectedPermissions = newSelectedPermissions.filter(id => id !== permission._id);
      permission.subMenus.forEach((subMenu: any) => {
        newSelectedPermissions = newSelectedPermissions.filter(id => id !== subMenu._id);
      });
    }
    setSelectedPermissions(newSelectedPermissions);
  };


  const handleSubMenuChange = (e: React.ChangeEvent<HTMLInputElement>, subMenu: any, parentMenuId: string, allSubMenus: any[]) => {
    const isChecked = e.target.checked;
    let newSelectedPermissions = [...selectedPermissions];

    if (isChecked) {
      if (!newSelectedPermissions.includes(subMenu._id)) {
        newSelectedPermissions.push(subMenu._id);
      }

      // Optionally select parent if all submenus are selected
      const allSelected = allSubMenus.every((sm: any) =>
        sm._id === subMenu._id ? true : newSelectedPermissions.includes(sm._id)
      );
      if (allSelected && !newSelectedPermissions.includes(parentMenuId)) {
        newSelectedPermissions.push(parentMenuId);
      }
    } else {
      newSelectedPermissions = newSelectedPermissions.filter(id => id !== subMenu._id);

      // If no submenus selected, remove parent menu
      const remainingSelected = allSubMenus.some((sm: any) =>
        sm._id !== subMenu._id && newSelectedPermissions.includes(sm._id)
      );

      if (!remainingSelected) {
        newSelectedPermissions = newSelectedPermissions.filter(id => id !== parentMenuId);
      }
    }

    setSelectedPermissions(newSelectedPermissions);
  };


  const handleUpdatePermission = async () => {
    const formattedPermissions: any = {
      role_id: role?.data?._id || role?._id || '',
      menus: []
    };

    permissionsMenuList.data.forEach((permission: any) => {
      const selectedSubMenus = permission.subMenus.filter((subMenu: any) =>
        selectedPermissions.includes(subMenu._id)
      );

      if (selectedPermissions.includes(permission._id) || selectedSubMenus.length > 0) {
        const menuEntry: any = {
          menu_id: permission._id,
          is_parent: 1,
        };

        if (selectedSubMenus.length > 0) {
          menuEntry.sub_menus = selectedSubMenus.map((subMenu: any) => ({
            menu_id: subMenu._id,
          }));
        }

        formattedPermissions.menus.push(menuEntry);
      }
    });

    try {
      await updatePermissionFn(formattedPermissions);
      toast.success("Role updated successfully")
      fetchRoles()
      toggleDrawer(false)
      return true;
    } catch (error) {
      toast.error("Error occured while Updating Permission")
    }

  };



  const selectPermissionMenusIds = role?.menus?.map(menu => menu?.menu_id);
  console.log(selectPermissionMenusIds)

  const selectPermissionSubMenusIds = role?.menus?.flatMap(menu => menu?.sub_menus?.map(subMenus => subMenus?.menu_id));
  console.log(selectPermissionSubMenusIds)

  return (
    <Drawer
      anchor="right"
      open={isDrawerOpen}
      onClose={() => toggleDrawer(false)}
    >
      <Box sx={{ width: 350, padding: 2 }}>
        <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 600, fontSize: "22px" }}>
          Assign Permissions
        </Typography>
        <Typography sx={{ fontSize: "20px", fontWeight: 600, marginBottom: 1, color: "green" }}>
          Role: {role?.data?.name || role?.name || 'N/A'}
        </Typography>
        <FormControl fullWidth sx={{ mb: 2, display: "grid", gridTemplateColumns: "2fr" }}>
          <Box>
            {permissionsMenuList?.data?.map((permission: any) => (
              <Box key={permission._id} sx={{ marginTop: "5px" }}>
                {/* <input
                  type="checkbox"
                  id={permission._id}
                  checked={
                    selectedPermissions.includes(permission._id) ||
                    permission.subMenus.every((subMenu: any) => selectedPermissions.includes(subMenu._id))
                  }

                  onChange={(e) => handleMainMenuChange(e, permission)}
                /> */}
                <input
                  type="checkbox"
                  id={permission._id}
                  checked={
                    selectedPermissions.includes(permission._id) ||
                    permission.subMenus.every((subMenu: any) => selectedPermissions.includes(subMenu._id))
                  }
                  onChange={(e) => handleMainMenuChange(e, permission)}
                />

                <label htmlFor={permission.name} className='ms-1 font-semibold text-lg'>{permission.name}</label>
                <ul className='ms-5'>
                  {permission.subMenus.map((subMenu: any) => (
                    <li key={subMenu._id}>
                      {/* <input
                        type="checkbox"
                        id={subMenu._id}
                        checked={selectPermissionSubMenusIds?.includes(subMenu._id) || selectedPermissions.includes(subMenu._id)}
                        onChange={(e) => handleSubMenuChange(e, subMenu, permission?._id, permission?.subMenus)}
                      /> */}
                      <input
                        type="checkbox"
                        id={subMenu._id}
                        checked={selectedPermissions.includes(subMenu._id)}
                        onChange={(e) => handleSubMenuChange(e, subMenu, permission?._id, permission?.subMenus)}
                      />

                      <label htmlFor={subMenu._id} className='ms-1'>{subMenu.name}</label>
                    </li>
                  ))}
                </ul>
              </Box>
            ))}
          </Box>
        </FormControl>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button onClick={() => toggleDrawer(false)} sx={{ mr: 1, backgroundColor: "gray", color: "white" }}>
            Close
          </Button>
          <Button sx={{ backgroundColor: "#ff505d", color: "white" }} onClick={handleUpdatePermission}>
            Update
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}

export default PermissionDrawer