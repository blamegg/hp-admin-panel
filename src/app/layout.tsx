"use client";
import React from "react";
import Loader from "@/components/common/Loader";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/provider/theme";
import { DirectionProvider, useDirection } from "@/context/DirectionContext";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReduxProvider } from "@/provider/ReduxProvider";
import { Toaster } from "sonner";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

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
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <QueryClientProvider client={queryClient}>
          <DirectionProvider>
            <ReduxProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <InnerRootLayout>{children}</InnerRootLayout>
              </LocalizationProvider>
            </ReduxProvider>
          </DirectionProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

const InnerRootLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { direction } = useDirection();
  return (
    <ThemeProvider theme={{ ...theme, direction }}>
      <div className={`dark:bg-boxdark-2 dark:text-bodydark ${direction === "rtl" ? "rtl" : "ltr"}`}>
        {children}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={1000}
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
    </ThemeProvider>
  );
};
