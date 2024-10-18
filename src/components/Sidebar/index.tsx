"use client";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { logo } from "@/assets";
import { useDirection } from "@/context/DirectionContext";
import { TbFileInvoice } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getMenuList } from "@/redux/slice/menuList";
import { defaultSvg, menuItems } from "@/utility/sidebar";
import { useQuery } from "@tanstack/react-query";
import { menuListFn } from "@/utility/queryFetcher";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const color = "#FF505D";
  const { direction } = useDirection();
  const { data: menu } = useQuery({
    queryKey: ["menuList"],
    queryFn: menuListFn,
  });

  const menuList = [
    {
      name: "MENU LIST",
      menuItems: menu?.data?.map((e: any) => {
        return {
          label: e.name,
          route: `/${e.slug.toLowerCase()}`,
          icon:
            menuItems.find(
              (menuIcon) =>
                menuIcon.name.toLowerCase() === e.name.toLowerCase(),
            )?.icon || defaultSvg,
        };
      }),
    },
  ];

  useEffect(() => {
    if (!menu) {
      dispatch(getMenuList());
    }
  }, [menu, dispatch]);

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed ${direction === "ltr" ? "left-0" : "right-0"} top-0 z-9999 flex h-full w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : direction === "ltr"
              ? "-translate-x-full"
              : "translate-x-full"
        }`}
      >
        <div className="grid h-[50px] place-items-center">
          <Link href="/dashboard" className="flex items-center gap-4">
            <Image width={35} height={35} src={logo.src} alt="Logo" priority />
            <h5 className="text-[20px] font-semibold text-white">
              Hanging Panda
            </h5>
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>

        <div className="no-scrollbar mt-5 flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav>
            {menuList?.length === 0 && <h6 className="text-[16px]">No Menu</h6>}
            {menuList.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.menuItems?.map((menuItem: any, menuIndex: any) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                      color={color}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
