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

import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";

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
    <DirectionProvider>
      <InnerRootLayout loading={loading}>{children}</InnerRootLayout>
    </DirectionProvider>
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
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider>
        <html lang="en" dir={direction}>
          <body suppressHydrationWarning={true}>
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
      </ReduxProvider>
    </QueryClientProvider>
  );
};
