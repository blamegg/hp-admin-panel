"use client";
import React, { useState, ReactNode, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useDirection } from "@/context/DirectionContext";
import BottomStrip from "../BottomStrip";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import ChangePasswordModal from "@/components/changePassword/ChangePasswordModal";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const { direction, toggleDirection } = useDirection();
  const router = useRouter();
  const pathname = usePathname();
  
  // Get user data from Redux
  const { user } = useSelector((state: RootState) => state.authReducer);
  const userInfo = user?.user;

  // Check if user has temporary password - check both possible paths
  const isTempPassword = user?.isTempPassword || userInfo?.isTempPassword;

  // Debug logging
  console.log("DefaultLayout Debug:", {
    user,
    userInfo,
    isTempPassword,
    pathname,
    showChangePasswordModal
  });

  // Show change password modal if user has temporary password
  useEffect(() => {
    console.log("useEffect triggered:", { isTempPassword, pathname });
    if (isTempPassword) {
      setShowChangePasswordModal(true);
      // Prevent navigation to any other page
      if (pathname !== "/dashboard") {
        router.push("/dashboard");
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
            <div className="mx-auto max-w-screen-2xl  w-ful py-2 md:px-6 md:py-3 2xl:px-10 2xl:py-4 ">
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
