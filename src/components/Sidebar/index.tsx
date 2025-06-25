"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { logo } from "@/assets";
import { useDirection } from "@/context/DirectionContext";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useMenuList } from "@/hooks/useMenuList";
import { useHasPermission } from '@/hooks/useUserPermissions';
import { getIconComponent } from "@/utility/iconMap";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const router = useRouter();

  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const color = "#FF505D";
  const { direction } = useDirection();

  // Use the useMenuList hook to get dynamic menu data
  const { menuList, isLoading } = useMenuList();

  console.log(menuList)

  // Get user data and permissions from Redux store
  const { user } = useSelector((state: RootState) => state.authReducer);

  // Check if user has temporary password - check both possible paths
  const isTempPassword = user?.isTempPassword || user?.user?.isTempPassword;

  // If user has temporary password, don't show the sidebar
  if (isTempPassword) {
    return null;
  }

  // Call the hook ONCE at the top
  const hasPermissionSingle = useHasPermission();
  const hasPermission = (requiredPermissions: string[] | undefined): boolean => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    return requiredPermissions.some((perm) => hasPermissionSingle(perm));
  };

  // Use dynamic menu from useMenuList hook, fallback to an empty array
  const dynamicMenuList = menuList && menuList.length > 0 ? [
    {
      name: "MENU LIST",
      menuItems: menuList
        .filter((e: any) => hasPermission(e.requiredPermissions))
        .map((e: any) => {
          return {
            label: e.name,
            route: e.url,
            icon: getIconComponent(e.icon_code),
            children: e.sub_menus?.filter((sub: any) => hasPermission(sub.requiredPermissions)).map((sub: any) => ({
              label: sub.name,
              route: sub.url,
              icon: getIconComponent(sub.icon_code),
            })),
          };
        }),
    },
  ] : [];


  // Navigation function to change password page
  const handleChangePassword = () => {
    router.push("/changePassword");
  };

  // Temporary Password Warning Component
  const TempPasswordWarning = () => (
    <div className="px-4 py-3 mb-4">
      <div className="rounded-lg bg-yellow-900/20 p-3 border border-yellow-600/30">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <h3 className="text-xs font-semibold text-yellow-400">Temporary Password</h3>
        </div>
        <p className="text-xs text-yellow-200/80 leading-relaxed mb-2">
          Change your password to access all features.
        </p>
        <button
          onClick={handleChangePassword}
          className="text-xs text-yellow-300 hover:text-yellow-100 underline cursor-pointer transition-colors"
        >
          Change Password →
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Temp Password Warning - Shows outside sidebar for mobile */}
      {isTempPassword && (
        <div className="lg:hidden fixed bottom-0 md:w-[calc(100%-100px)] md:rounded-tr-sm left-0 md:right-0 z-[9997] bg-yellow-900/95 border-b border-yellow-600/30 px-1 md:px-4 py-2">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-xs md:text-sm font-medium text-yellow-200">
                Temporary Password
              </span>
            </div>
            <button
              onClick={handleChangePassword}
              className="text-xs md:text-sm text-yellow-300 hover:text-yellow-100 underline cursor-pointer transition-colors"
            >
              Change Now
            </button>
          </div>
        </div>
      )}

      <ClickOutside onClick={() => setSidebarOpen(false)}>
        <aside
          className={`fixed ${direction === "ltr" ? "left-0" : "right-0"} top-0 z-9999 flex h-full w-52.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${sidebarOpen
            ? "translate-x-0"
            : direction === "ltr"
              ? "-translate-x-full"
              : "translate-x-full"
            } ${isTempPassword ? 'lg:top-0' : ''}`}
        >
          <div className="grid h-[50px] place-items-center">
            <Link href="/dashboard" className="flex items-center justify-start gap-2 ">
              <Image width={30} height={30} src={logo.src} alt="Logo" priority />
              <h5 className="text-[17px] font-semibold text-white">
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
              {isLoading ? (
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 text-bodydark2">
                    <div className="w-4 h-4 border-2 border-bodydark2 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Loading menu...</span>
                  </div>
                </div>
              ) : (
                dynamicMenuList.map((group: any, groupIndex: number) => (
                  <div key={groupIndex}>
                    <h3 className="ml-4 mr-4 text-sm text-[13px] font-semibold text-bodydark2">
                      {group.name}
                    </h3>

                    <ul className="flex flex-col gap-1.5">
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
                ))
              )}
            </nav>

            {/* Desktop Temp Password Warning - Shows inside sidebar */}
            {isTempPassword && (
              <div className="hidden lg:block">
                <TempPasswordWarning />
              </div>
            )}
          </div>
        </aside>
      </ClickOutside>
    </>
  );
};

export default Sidebar;
