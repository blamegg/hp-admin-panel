import React from "react";
import Link from "next/link";
import SidebarDropdown from "@/components/Sidebar/SidebarDropdown";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const SidebarItem = ({ item, pageName, setPageName, color }: any) => {
  const appColor = useSelector((state: RootState) => state?.app?.color);
  const handleClick = () => {
    const updatedPageName =
      pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
    return setPageName(updatedPageName);
  };

  const pathname = usePathname();

  const isActive = (item: any) => {
    if (item.route === pathname) return true;
    if (item.children) {
      return item.children.some((child: any) => isActive(child));
    }
    return false;
  };

  const isItemActive = isActive(item);

  // Provide fallback href to prevent undefined error
  const href = item.route || "#";

  return (
    <>
      <li>
        <Link
          href={href}
          onClick={handleClick}
          style={{ backgroundColor: isItemActive ? appColor : "" }}
          className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2  font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4`}
        >
          <span>{item.icon}</span>
          
          <p className="text-[13px]">{item.label}</p>
        </Link>

        {item.children && (
          <div
            className={`translate transform overflow-hidden ${
              pageName !== item.label.toLowerCase() && "hidden"
            }`}
          >
            {/* <SidebarDropdown item={item.children} /> */}
          </div>
        )}
      </li>
    </>
  );
};

export default SidebarItem;
