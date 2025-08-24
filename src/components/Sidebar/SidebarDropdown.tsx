import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarDropdown = ({ item }: any) => {
  const pathname = usePathname();

  return (
    <>
      <ul className="mb-5.5 mt-1 flex flex-col gap-2 pl-4">
        {item.map((item: any, index: number) => {
          // Provide fallback href to prevent undefined error
          const href = item.route || "#";
          return (
            <li key={index}>
              <Link
                href={href}
                className={`group relative flex items-center gap-2 rounded-md  font-medium text-bodydark2 text-[12px] duration-300 ease-in-out hover:text-white ${pathname === item.route ? "text-white" : ""}`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default SidebarDropdown;
