import {
  CurrentRoleDataInterFace,
  RolesInterFace2,
  updatePermissionFn,
  subMenuInterFace,
  menuDataInterface,
  ManusInterface
} from '@/utility/queryFetcher';
import { Box, FormControl } from '@mui/material';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import Button from '../common/Button';

interface PermissionDrawerProps {
  permissionsMenuList: RolesInterFace2 | null;
  fetchRoles: () => void;
  currentRole: CurrentRoleDataInterFace | null;
  toggleDrawer:(open:boolean)=> void;
}

const Permissions: React.FC<PermissionDrawerProps> = ({
  permissionsMenuList,
  fetchRoles,
  currentRole,
  toggleDrawer
}) => {
  const [selectedPermissionsId, setSelectedPermissionsId] = React.useState<string[]>([]);

  // Initialize selectedPermissionsId from currentRole
  useEffect(() => {
    if (!currentRole || !currentRole.menus) return;
    const mainIds = currentRole?.menus.map(menu => menu.menu_id) || [];
    const subIds = currentRole?.menus.flatMap(menu =>
      menu.sub_menus?.map(sub => sub.sub_menu_id) || []
    ) || [];
    const combined = [...subIds, ...mainIds];
    setSelectedPermissionsId(combined);
  }, [currentRole]);



  const handleMainMenuChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    permission: menuDataInterface
  ) => {
    const isChecked = e.target.checked;
    let newSelected = [...selectedPermissionsId];

    if (isChecked) {
      // Add main menu ID
      if (!newSelected.includes(permission.menu_id)) {
        newSelected.push(permission.menu_id);
      }

      // Add all sub_menu_ids
      permission.sub_menus.forEach(sub => {
        if (!newSelected.includes(sub.sub_menu_id)) {
          newSelected.push(sub.sub_menu_id);
        }
      });
    } else {
      // Remove main menu ID and its submenus
      newSelected = newSelected.filter(id => id !== permission.menu_id);
      permission.sub_menus.forEach(sub => {
        newSelected = newSelected.filter(id => id !== sub.sub_menu_id);
      });
    }

    setSelectedPermissionsId(newSelected);
  };

  const handleSubMenuChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    subMenu: subMenuInterFace,
    parentMenuId: string,
    allSubMenus: subMenuInterFace[]
  ) => {
    const isChecked = e.target.checked;
    let newSelected = [...selectedPermissionsId];

    if (isChecked) {
      if (!newSelected.includes(subMenu.sub_menu_id)) {
        newSelected.push(subMenu.sub_menu_id);
      }

      const allChecked = allSubMenus.every(sub =>
        sub.sub_menu_id === subMenu.sub_menu_id ? true : newSelected.includes(sub.sub_menu_id)
      );
      if (allChecked && !newSelected.includes(parentMenuId)) {
        newSelected.push(parentMenuId);
      }
    } else {
      newSelected = newSelected.filter(id => id !== subMenu.sub_menu_id);

      const remainingSubmenus = allSubMenus.some(sub =>
        sub.sub_menu_id !== subMenu.sub_menu_id && newSelected.includes(sub.sub_menu_id)
      );
      if (!remainingSubmenus) {
        newSelected = newSelected.filter(id => id !== parentMenuId);
      }
    }

    setSelectedPermissionsId(newSelected);
  };

  const handleUpdatePermission = async () => {
    const formattedPermissions: ManusInterface = {
      role_id: currentRole._id,
      menus: [],
      _id: "",
      __v: 0,
      createdAt: "",
      updatedAt: "",
      updated_by: "",
      created_by: { email: "", name: "", _id: "" },
      deleted: false,
      name: "",
      status: false,
    };

    if (permissionsMenuList?.data) {
      permissionsMenuList.data.forEach((permission: menuDataInterface) => {
        const selectedSubMenus = permission.sub_menus.filter(sub =>
          selectedPermissionsId.includes(sub.sub_menu_id)
        );

        if (
          selectedPermissionsId.includes(permission.menu_id) ||
          selectedSubMenus.length > 0
        ) {
          formattedPermissions.menus.push({
            menu_id: permission.menu_id,
            is_parent: "1",
            name: permission.name,
            sub_menus: selectedSubMenus.map(sub => ({
              menu_id: sub.sub_menu_id, // use sub_menu_id here as it's your unique submenu identifier
              name: sub.name,
            })),
          });
        }
      });
    }

    try {
      await updatePermissionFn(formattedPermissions);
      toast.success("Permissions updated successfully");
      fetchRoles();
      toggleDrawer(false)
    } catch (error) {
      toast.error("Error while updating permissions");
    }
  };

  return (
    <div>
      <FormControl
        fullWidth
        sx={{
          height: "420px",
          mb: 2,
          display: "grid",
          gridTemplateColumns: "2fr",
          overflow: "scroll",
          paddingLeft: "25px"
        }}
      >
        <div className='grid grid-cols-5 gap-2'>
          {permissionsMenuList?.data?.map(permission => (
            <Box key={permission.menu_id}>
              <input
                type="checkbox"
                id={permission.menu_id}
                checked={selectedPermissionsId.includes(permission.menu_id)}
                onChange={(e) => handleMainMenuChange(e, permission)}
              />
              <label htmlFor={permission.menu_id} className='ms-1 font-semibold text-[14px]'>
                {permission.name}
              </label>

              <ul className='ms-5'>
                {permission.sub_menus.map(sub => (
                  <li key={sub.sub_menu_id}>
                    <input
                      type="checkbox"
                      id={sub.sub_menu_id}
                      checked={selectedPermissionsId.includes(sub.sub_menu_id)}
                      onChange={(e) =>
                        handleSubMenuChange(e, sub, permission.menu_id, permission.sub_menus)
                      }
                    />
                    <label htmlFor={sub.sub_menu_id} className='ms-1 text-[12px]'>
                      {sub.name}
                    </label>
                  </li>
                ))}
              </ul>
            </Box>
          ))}
        </div>
      </FormControl>

      <div className='flex justify-end items-center gap-2 absolute bottom-0 h-[60px] w-full pr-4 border-t-2 border-gray'>
        <Button type="button" name="Close" className="mr-4" style={{ backgroundColor: "gray" }} onClick={()=> toggleDrawer(false)} />
        <Button type="button" name="Update" style={{backgroundColor:"#00b300"}}  className="text-white" onClick={handleUpdatePermission} />
      </div>
    </div>
  );
};

export default Permissions;
