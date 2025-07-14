"use client";
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/provider/theme";
import { DirectionProvider, useDirection } from "@/context/DirectionContext";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReduxProvider } from "@/provider/ReduxProvider";
import { Toaster } from "sonner";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Critical CSS - load immediately
import "@/css/satoshi.css";
import "@/css/style.css";

// Non-critical CSS - load asynchronously
import "react-toastify/dist/ReactToastify.css";

// Create a stable QueryClient instance with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
      // Add request deduplication
      refetchInterval: false,
      // Optimize for better caching
      structuralSharing: true,
    },
    mutations: {
      retry: 1,
      // Optimize mutation behavior
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});

// Lazy load non-critical CSS
const loadNonCriticalCSS = () => {
  if (typeof window !== 'undefined') {
    // Load non-critical CSS dynamically
    const link1 = document.createElement('link');
    link1.rel = 'stylesheet';
    link1.href = '/_next/static/css/jsvectormap.css';
    document.head.appendChild(link1);

    const link2 = document.createElement('link');
    link2.rel = 'stylesheet';
    link2.href = '/_next/static/css/flatpickr.min.css';
    document.head.appendChild(link2);
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Load non-critical CSS after initial render
  React.useEffect(() => {
    loadNonCriticalCSS();
  }, []);

  return (
    <html lang="en">
      <head>
        {/* Preload critical resources */}
        <link rel="preload" href="/fonts/Satoshi-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Satoshi-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
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
