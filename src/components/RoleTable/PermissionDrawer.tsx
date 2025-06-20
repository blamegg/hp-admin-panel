import {
  CurrentRoleDataInterFace,
  RolesInterFace2,
  updatePermissionFn,
  subMenuInterFace,
  menuDataInterface,
  ManusInterface,
  UpdatePermissionsInterFace,
  updateMenuOrderFn
} from '@/utility/queryFetcher';
import { Box, FormControl, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Button from '../common/Button';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface PermissionDrawerProps {
  permissionsMenuList: RolesInterFace2 | null;
  fetchRoles: () => void;
  currentRole: CurrentRoleDataInterFace | null;
  toggleDrawer: (open: boolean) => void;
}

// Sortable Sub-Menu Item Component
const SortableSubMenuItem = ({
  subMenu,
  parentMenuId,
  allSubMenus,
  selectedPermissionsId,
  handleSubMenuChange,
  onReorder
}: {
  subMenu: subMenuInterFace;
  parentMenuId: string;
  allSubMenus: subMenuInterFace[];
  selectedPermissionsId: string[];
  handleSubMenuChange: (e: React.ChangeEvent<HTMLInputElement>, subMenu: subMenuInterFace, parentMenuId: string, allSubMenus: subMenuInterFace[]) => void;
  onReorder: (oldIndex: number, newIndex: number, parentMenuId: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: subMenu.sub_menu_id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-baseline gap-2 rounded transition-all duration-200 hover:bg-gray-50 ${isDragging ? 'bg-blue-50 border border-blue-200 shadow-sm' : ''
        }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors rounded hover:bg-gray-100"
        title="Drag to reorder sub-menu"
      >
        <GripVertical size={12} />
      </button>
      <input
        type="checkbox"
        id={subMenu.sub_menu_id}
        checked={selectedPermissionsId.includes(subMenu.sub_menu_id)}
        onChange={(e) =>
          handleSubMenuChange(e, subMenu, parentMenuId, allSubMenus)
        }
        className='size-[10px]'
      />
      <label htmlFor={subMenu.sub_menu_id} className='text-[12px] cursor-pointer flex-1 hover:text-blue-600 transition-colors'>
        {subMenu.name}
      </label>
    </li>
  );
};

// Sortable Permission Item Component
const SortablePermissionItem = ({
  permission,
  selectedPermissionsId,
  handleMainMenuChange,
  handleSubMenuChange,
  onReorderSubMenus
}: {
  permission: menuDataInterface;
  selectedPermissionsId: string[];
  handleMainMenuChange: (e: React.ChangeEvent<HTMLInputElement>, permission: menuDataInterface) => void;
  handleSubMenuChange: (e: React.ChangeEvent<HTMLInputElement>, subMenu: subMenuInterFace, parentMenuId: string, allSubMenus: subMenuInterFace[]) => void;
  onReorderSubMenus: (oldIndex: number, newIndex: number, parentMenuId: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: permission.menu_id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  const handleSubMenuDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = permission.sub_menus.findIndex(sub => sub.sub_menu_id === active.id);
      const newIndex = permission.sub_menus.findIndex(sub => sub.sub_menu_id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onReorderSubMenus(oldIndex, newIndex, permission.menu_id);
      }
    }
  };

  const [isSubMenuDragging, setIsSubMenuDragging] = React.useState(false);

  const handleSubMenuDragStart = () => {
    setIsSubMenuDragging(true);
  };

  const handleSubMenuDragEndWithFeedback = (event: DragEndEvent) => {
    setIsSubMenuDragging(false);
    handleSubMenuDragEnd(event);
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      className={`border border-blue-300   rounded-lg p-1 bg-white shadow-sm hover:shadow-md transition-all duration-200 ${isDragging ? 'shadow-lg scale-105' : ''
        } ${isSubMenuDragging ? 'border-blue-300 bg-blue-50' : ''
        }`}
    >
      <div className="flex items-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-secondary hover:text-gray-600 transition-colors p-1 rounded"
          title="Drag to reorder permission"
        >
          <GripVertical size={16} />
        </button>
        <input
          type="checkbox"
          id={permission.menu_id}
          checked={selectedPermissionsId.includes(permission.menu_id)}
          onChange={(e) => handleMainMenuChange(e, permission)}
          className='size-[10px]'
        />
        <label htmlFor={permission.menu_id} className='font-semibold text-[14px] cursor-pointer flex-1'>
          {permission.name}
        </label>
      </div>

      <DndContext
        sensors={useSensors(
          useSensor(PointerSensor),
          useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
          })
        )}
        collisionDetection={closestCenter}
        onDragEnd={handleSubMenuDragEndWithFeedback}
      >
        <SortableContext
          items={permission.sub_menus.map(sub => sub.sub_menu_id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className='ms-6 space-y'>
            {permission.sub_menus.map(sub => (
              <SortableSubMenuItem
                key={sub.sub_menu_id}
                subMenu={sub}
                parentMenuId={permission.menu_id}
                allSubMenus={permission.sub_menus}
                selectedPermissionsId={selectedPermissionsId}
                handleSubMenuChange={handleSubMenuChange}
                onReorder={() => { }} // This will be handled by the parent
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </Box>
  );
};

const Permissions: React.FC<PermissionDrawerProps> = ({
  permissionsMenuList,
  fetchRoles,
  currentRole,
  toggleDrawer,
}) => {
  const [selectedPermissionsId, setSelectedPermissionsId] = useState<string[]>([]);
  const [orderedPermissions, setOrderedPermissions] = useState<menuDataInterface[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  // Initialize ordered permissions from menu list
  useEffect(() => {
    if (permissionsMenuList?.data) {
      setOrderedPermissions(permissionsMenuList.data);
    }
  }, [permissionsMenuList]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setOrderedPermissions((items) => {
        const oldIndex = items.findIndex(item => item.menu_id === active.id);
        const newIndex = items.findIndex(item => item.menu_id === over?.id);

        const newOrder = arrayMove(items, oldIndex, newIndex);
        console.log("🔍 Main permissions reordered:", newOrder.map(p => p.name));
        return newOrder;
      });
    }
  };

  const handleSubMenuReorder = (oldIndex: number, newIndex: number, parentMenuId: string) => {
    setOrderedPermissions((items) => {
      return items.map(item => {
        if (item.menu_id === parentMenuId) {
          const newSubMenus = arrayMove([...item.sub_menus], oldIndex, newIndex);
          console.log("🔍 Sub-menus reordered for", item.name, ":", newSubMenus.map(sub => sub.name));
          return {
            ...item,
            sub_menus: newSubMenus
          };
        }
        return item;
      });
    });
  };

  const handleResetOrder = () => {
    if (permissionsMenuList?.data) {
      setOrderedPermissions(permissionsMenuList.data);
      toast.success("Permission order reset to default");
    }
  };

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

    if (!currentRole) return;
    const formattedPermissions: UpdatePermissionsInterFace = {
      role_id: currentRole._id,
      menus: [],
      name: currentRole?.name,
    };

    // Use orderedPermissions instead of permissionsMenuList?.data to maintain order
    if (orderedPermissions.length > 0) {
      orderedPermissions.forEach((permission: menuDataInterface, mainIndex: number) => {
        const selectedSubMenus = permission.sub_menus.filter(sub =>
          selectedPermissionsId.includes(sub.sub_menu_id)
        );

        if (
          selectedPermissionsId.includes(permission.menu_id) ||
          selectedSubMenus.length > 0
        ) {
          formattedPermissions.menus.push({
            menu_id: permission.menu_id,
            name: permission.name,
            order: mainIndex, // Main menu order
            sub_menus: selectedSubMenus.map((sub, subIndex) => ({
              sub_menu_id: sub.sub_menu_id,
              name: sub.name,
              order: subIndex, // Sub-menu order within the parent
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
    } catch (error: any) {
      let errorMessage = error?.response?.data?.message;
      if (typeof errorMessage !== "string") {
        errorMessage = "unknown error";
      }
      toast.error(errorMessage);
    }
  };

  const handleSaveOrder = async () => {
    console.log(currentRole)
    if (!currentRole) return;

    // Prepare order data for the menu order API
    const orderData = {
      orders: [] as { id: string; order: number }[]
    };

    // Use orderedPermissions to get the current order
    if (orderedPermissions.length > 0) {
      orderedPermissions.forEach((permission: menuDataInterface, mainIndex: number) => {
        // Add main menu order
        orderData.orders.push({
          id: permission.menu_id,
          order: mainIndex + 1
        });
      });
    }

    try {
      await updateMenuOrderFn(orderData);
      toast.success("Menu order saved successfully");
    } catch (error: any) {
      let errorMessage = error?.response?.data?.message;
      if (typeof errorMessage !== "string") {
        errorMessage = "Failed to save menu order";
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <FormControl
        fullWidth
        sx={{
          maxHeight:{xs:"330px", sm:"830px", md:"600px", lg:"430px"},
          mb: 2,
          mt:{xs:1, md:3},
          display: "grid",
          gridTemplateColumns: "1fr",
          overflow: "scroll",
          paddingLeft: "25px",
          paddingRight: "25px"
        }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={orderedPermissions.map(p => p.menu_id)}
            strategy={verticalListSortingStrategy}
          >
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3   '>
              {orderedPermissions.map(permission => (
                <SortablePermissionItem
                  key={permission.menu_id}
                  permission={permission}
                  selectedPermissionsId={selectedPermissionsId}
                  handleMainMenuChange={handleMainMenuChange}
                  handleSubMenuChange={handleSubMenuChange}
                  onReorderSubMenus={handleSubMenuReorder}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </FormControl>
      <div className='grid grid-cols-2 md:flex justify-between items-center gap-2 absolute bottom-0 h-[50px]  w-full px-4 border-2 border-danger'>
        <div className='flex flex-col-reverse md:flex md:flex-row gap-3 items-center'>
          <Button type="button" name="Reset Order" className="bg-graydark hover:bg-gray-600 w-full md:w-auto" onClick={handleResetOrder} />
          <Button type="button" name="Save Order" className="bg-success w-full md:w-auto" onClick={handleSaveOrder} />
        </div>
        <div className="flex flex-col-reverse md:flex md:flex-row gap-2">
          <Button type="button" name="Close" className="bg-graydark w-full md:w-auto" onClick={() => toggleDrawer(false)} />
          <Button type="button" name="Update" className="bg-success w-full md:w-auto" onClick={handleUpdatePermission} />
        </div>
      </div>
    </div>
  );
};

export default Permissions;
