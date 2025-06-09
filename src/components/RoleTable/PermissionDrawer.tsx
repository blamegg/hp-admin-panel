import { CurrentRoleDataInterFace, RolesInterFace2, updatePermissionFn, mainMenuInterface, subMenuInterFace, RoleDataInterFace2, menuDataInterface, ManusInterface } from '@/utility/queryFetcher';
import { Drawer, Box, Typography, Button, FormControl } from '@mui/material'
import React from 'react'
import { toast } from 'sonner';

interface PermissionDrawerProps {
  // isDrawerOpen: boolean;
  // toggleDrawer: (open: boolean, role?: CurrentRoleDataInterFace | RolesInterFace2 | null) => void;
  permissionsMenuList: RolesInterFace2 | null;
  role?: CurrentRoleDataInterFace | RolesInterFace2 | null;
  fetchRoles: () => void;
}

const Permissions: React.FC<PermissionDrawerProps> = ({
  // toggleDrawer,
  permissionsMenuList,
  role,
  fetchRoles
}) => {
  const [selectedPermissions, setSelectedPermissions] = React.useState<string[]>([]);

  React.useEffect(() => {
    // if (role && 'menus' in role && role.menus) {
    //   const initialPermissions: string[] = [];

    //   role.menus.forEach((menu: mainMenuInterface) => {
    //     initialPermissions.push(menu.menu_id);
    //     menu?.sub_menus?.forEach((sub: subMenuInterFace) => {
    //       initialPermissions.push(sub.menu_id);
    //     });
    //   });

    //   setSelectedPermissions(initialPermissions);
    // }
  }, [role]);

  const handleMainMenuChange = (e: React.ChangeEvent<HTMLInputElement>, permission: menuDataInterface) => {
  //   const isChecked = e.target.checked;
  //   let newSelectedPermissions = [...selectedPermissions];

  //   if (isChecked) {
  //     newSelectedPermissions.push(permission._id);
  //     permission.sub_menus.forEach((subMenu: subMenuInterFace) => {
  //       if (!newSelectedPermissions.includes(subMenu._id)) {
  //         newSelectedPermissions.push(subMenu._id);
  //       }
  //     });
  //   } else {
  //     newSelectedPermissions = newSelectedPermissions.filter(id => id !== permission._id);
  //     permission.sub_menus.forEach((subMenu: subMenuInterFace) => {
  //       newSelectedPermissions = newSelectedPermissions.filter(id => id !== subMenu._id);
  //     });
  //   }
  //   setSelectedPermissions(newSelectedPermissions);
  };

  const handleSubMenuChange = (e: React.ChangeEvent<HTMLInputElement>, subMenu: subMenuInterFace, parentMenuId: string, allSubMenus: subMenuInterFace[]) => {
  //   const isChecked = e.target.checked;
  //   let newSelectedPermissions = [...selectedPermissions];

  //   if (isChecked) {
  //     if (!newSelectedPermissions.includes(subMenu._id)) {
  //       newSelectedPermissions.push(subMenu._id);
  //     }

  //     const allSelected = allSubMenus.every((sm: subMenuInterFace) =>
  //       sm._id === subMenu._id ? true : newSelectedPermissions.includes(sm._id)
  //     );
  //     if (allSelected && !newSelectedPermissions.includes(parentMenuId)) {
  //       newSelectedPermissions.push(parentMenuId);
  //     }
  //   } else {
  //     newSelectedPermissions = newSelectedPermissions.filter(id => id !== subMenu._id);

  //     const remainingSelected = allSubMenus.some((sm: subMenuInterFace) =>
  //       sm._id !== subMenu._id && newSelectedPermissions.includes(sm._id)
  //     );

  //     if (!remainingSelected) {
  //       newSelectedPermissions = newSelectedPermissions.filter(id => id !== parentMenuId);
  //     }
  //   }

  //   setSelectedPermissions(newSelectedPermissions);
  };

  const handleUpdatePermission = async () => {
  //   const formattedPermissions: ManusInterface = {
  //     role_id:
  //       role && typeof role === 'object'
  //         ? ('data' in role && role.data && '_id' in role.data
  //           ? (role.data as RoleDataInterFace2)._id
  //           : ('_id' in role && typeof role._id === 'string' ? role._id : '')
  //         )
  //         : '',
  //     menus: [] as mainMenuInterface[],
  //   };
  //   if (permissionsMenuList?.data) {
  //     permissionsMenuList.data.forEach((permission: menuDataInterface) => {
  //       const selectedSubMenus = permission.sub_menus.filter((subMenu: subMenuInterFace) =>
  //         selectedPermissions.includes(subMenu._id)
  //       );

  //       if (selectedPermissions.includes(permission._id) || selectedSubMenus.length > 0) {
  //         const menuEntry: mainMenuInterface = {
  //           menu_id: permission._id,
  //           is_parent: "1",
  //           name: permission.name,
  //           sub_menus: []
  //         };

  //         if (selectedSubMenus.length > 0) {
  //           menuEntry.sub_menus = selectedSubMenus.map((subMenu: subMenuInterFace) => ({
  //             menu_id: subMenu._id,
  //             name: subMenu.name,
  //           }));
  //         }

  //         formattedPermissions.menus.push(menuEntry);
  //       }
  //     });
  //   }

  //   try {
  //     await updatePermissionFn(formattedPermissions);
  //     toast.success("Role updated successfully")
  //     fetchRoles()
  //     toggleDrawer(false)
  //     return true;
  //   } catch (error: any) {
  //     toast.error("Error occured while Updating Permission")
  //   }

  };

  return (
      <div className='w-[100%] py-2 px-4 overflow-auto h-[400px]'>
        
        <FormControl fullWidth sx={{ mb: 2, display: "grid", gridTemplateColumns: "2fr" }}>
          <div className='grid grid-cols-4 '>
            {permissionsMenuList?.data?.map((permission: menuDataInterface) => (
              <Box key={permission._id} sx={{ marginTop: "5px" }}>
                <input
                  type="checkbox"
                  id={permission._id}
                  checked={
                    selectedPermissions.includes(permission._id) ||
                    permission.sub_menus.every((subMenu: subMenuInterFace) => selectedPermissions.includes(subMenu._id))
                  }
                  onChange={(e) => handleMainMenuChange(e, permission)}
                />

                <label htmlFor={permission.name} className='ms-1 font-semibold text-[14px]'>{permission.name}</label>
                <ul className='ms-5'>
                  {permission.sub_menus.map((subMenu: subMenuInterFace) => (
                    <li key={subMenu._id}>
                      <input
                        type="checkbox"
                        id={subMenu._id}
                        checked={selectedPermissions.includes(subMenu._id)}
                        className='size-[10px]'
                        onChange={(e) => handleSubMenuChange(e, subMenu, permission?._id, permission?.sub_menus)}
                      />

                      <label htmlFor={subMenu._id} className='ms-1 text-[12px]'>{subMenu.name}</label>
                    </li>
                  ))}
                </ul>
              </Box>
            ))}
          </div>
        </FormControl>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button onClick={() => toggleDrawer(false)} sx={{ mr: 1, backgroundColor: "gray", color: "white" }}>
            Close
          </Button>
          <Button sx={{ backgroundColor: "#ff505d", color: "white" }} onClick={handleUpdatePermission}>
            Update
          </Button>
        </Box>
      </div>
  )
}

export default Permissions