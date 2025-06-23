"use client";
import React, { useState, ReactNode, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useDirection } from "@/context/DirectionContext";
import BottomStrip from "../BottomStrip";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter, usePathname } from "next/navigation";
import ChangePasswordModal from "@/components/changePassword/ChangePasswordModal";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchLeaveType } from "@/redux/slice/leaveTypesSlice";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const { direction } = useDirection();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();

  // Get user data from Redux
  const { user } = useSelector((state: RootState) => state.authReducer);
  const userInfo = user?.user;

  useUserPermissions();

  // Check if user has temporary password - check both possible paths
  const isTempPassword = user?.isTempPassword || userInfo?.isTempPassword;

  // Show change password modal if user has temporary password
  useEffect(() => {
    if (isTempPassword) {
      setShowChangePasswordModal(true);
      // Only redirect if not already on dashboard
      if (pathname !== "/dashboard") {
        router.replace("/dashboard");
      }
    } else {
      setShowChangePasswordModal(false);
    }
  }, [isTempPassword, pathname, router]);

  // Handle modal close
  const handleModalClose = () => {
    // Only allow closing if user doesn't have temporary password
    if (!isTempPassword) {
      setShowChangePasswordModal(false);
    }
  };

  // Fetch leave types globally on layout mount
  useEffect(() => {
    dispatch(fetchLeaveType());
  }, [dispatch]);

  // If user has temporary password, show only the modal overlay
  if (isTempPassword) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-boxdark">
        {/* Overlay background */}
        <div className="fixed inset-0 bg-black/50 z-40"></div>

        {/* Modal */}
        <ChangePasswordModal
          open={showChangePasswordModal}
          onClose={handleModalClose}
        />

        {/* Loading indicator */}
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Please change your temporary password to continue...
            </p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div
          className={`relative flex flex-1 flex-col ${direction === "ltr" ? "lg:ml-52.5" : "lg:mr-52.5"}`}
        >
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="h-full overflow-y-auto mx-auto max-w-screen-2xl w-full px-3 py-2 md:px-6 md:py-3 2xl:px-10 2xl:py-4">
              {children}
            </div>
            <BottomStrip />
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </>
  );
}
