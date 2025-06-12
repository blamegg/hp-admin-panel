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
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchRoleFn } from "@/redux/slice/roleSlice";
import { dynamicMenuListFn } from "@/utility/queryFetcher";
import { setPermissions } from "@/redux/slice/authSlice";
import { useQuery } from '@tanstack/react-query';

import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

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
  const { direction, toggleDirection } = useDirection();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchRoleFn({ page: 1, limit: 10 }));
  }, [dispatch]);

  const { data } = useQuery({
    queryKey: ["menuList"],
    queryFn: dynamicMenuListFn,
  });

  useEffect(() => {
    if (data?.data) {
      const userPermissions = data.data
        .map((permission: any) => permission.sub_menus)
        .flat()
        .map((sub: any) => sub.name);
      dispatch(setPermissions(userPermissions));
    }
  }, [data, dispatch]);

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
