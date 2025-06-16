import { FaUsersGear } from "react-icons/fa6";
import {
  TbHome,
  TbUser,
  TbSettings,
  TbMessageCircle,
  TbFileInvoice,
} from "react-icons/tb";

// Default icon
export const defaultSvg = <TbFileInvoice size={18} />;


// Sidebar icons list
export const menuItems = [
  {
    name: "Home",
    icon: <TbHome size={18} />,
  },
  {
    name: "Users",
    icon: <TbUser size={18} />,
  },
  {
    name: "Settings",
    icon: <TbSettings size={18} />,
  },
  {
    name: "Messages",
    icon: <TbMessageCircle size={18} />,
  },
  {
    name: "Roles",
    icon: <FaUsersGear size={18} />,
    route: "/roles"
  },
  // {
  //   name: "Permissions",
  //   icon: <MdLockOutline size={18} />,
  // },
];

export const staticMenu = [
  {
    name: "MENU LIST",
    menuItems: menuItems.map((menuItem) => ({
      label: menuItem.name,
      route: menuItem.route || `/${menuItem.name.replace(/\s+/g, "").toLowerCase()}`, 
      icon: menuItem.icon || defaultSvg,
    })),
  },
];
