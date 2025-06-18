"use client";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/provider/theme";
import { DirectionProvider, useDirection } from "@/context/DirectionContext";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReduxProvider } from "@/provider/ReduxProvider";
import { Toaster } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUserPermissions } from "@/redux/slice/authSlice";

import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import "react-toastify/dist/ReactToastify.css";

// Create a stable QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <DirectionProvider>
        <ReduxProvider>
          <InnerRootLayout loading={loading}>{children}</InnerRootLayout>
        </ReduxProvider>
      </DirectionProvider>
    </QueryClientProvider>
  );
}

const InnerRootLayout = ({
  loading,
  children,
}: {
  loading: boolean;
  children: React.ReactNode;
}) => {
  const { direction } = useDirection();
  const dispatch = useDispatch<AppDispatch>();
  
  // Get user data from Redux
  const user = useSelector((state: RootState) => state.authReducer.user);
  const permissionsStatus = useSelector((state: RootState) => state.authReducer.permissionsStatus);
  
  useEffect(() => {
    if (user && user.role && user.role._id && permissionsStatus === "idle") {
      dispatch(fetchUserPermissions(user.role._id));
    }
  }, [user, permissionsStatus, dispatch]);

  return (
    <html lang="en" dir={direction}>
      <body suppressHydrationWarning={true} className="">
        <ThemeProvider theme={{ ...theme, direction }}>
          <div
            className={`dark:bg-boxdark-2 dark:text-bodydark ${direction === "rtl" ? "rtl" : "ltr"}`}
          >
            {loading ? <Loader /> : children}
          </div>
        </ThemeProvider>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          toastClassName="custom-toast-container"
        />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
};
