import {
  TbHome,
  TbUser,
  TbSettings,
  TbMessageCircle,
  TbFileInvoice,
} from "react-icons/tb";

// default icon
export const defaultSvg = <TbFileInvoice size={18} />;

// sidebar icons list
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
];

export const staticMenu = [
  {
    name: "MENU LIST",
    menuItems: menuItems.map((menuItem) => ({
      label: menuItem.name,
      route: `/${menuItem.name.toLowerCase()}`,
      icon: menuItem.icon || defaultSvg,
    })),
  },
];
