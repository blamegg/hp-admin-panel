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
    name: "Profile",
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
