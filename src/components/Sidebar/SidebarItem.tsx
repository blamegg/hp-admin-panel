import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import SidebarDropdown from "./SidebarDropdown";

const SidebarItem = ({ item, pageName, setPageName, color }: any) => {
  const appColor = useSelector((state: RootState) => state?.app?.color);
  const pathname = usePathname();

  const handleClick = () => {
    const updatedPageName =
      pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
    setPageName(updatedPageName);
  };

  const isActive = (item: any) => {
    if (item.route === pathname) return true;
    if (item.children) {
      return item.children.some((child: any) => isActive(child));
    }
    return false;
  };

  const isItemActive = isActive(item);
  const href = item.route || "#";


  return (
    <li>
      <Link
        href={href}
        onClick={handleClick}
        style={{ backgroundColor: isItemActive ? appColor : "" }}
        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4`}
      >
        {/* Add spacing or styling to icon */}
        {item.icon && (
          <span className="text-[18px] text-gray-400">{item.icon}</span>
        )}
        <p className="text-[13px]">{item.label}</p>
      </Link>

      {item.children && (
        <div
          className={`translate transform overflow-hidden ${
            pageName !== item.label.toLowerCase() && "hidden"
          }`}
        >
          <SidebarDropdown item={item.children} />
        </div>
      )}
    </li>
  );
};

export default SidebarItem;
