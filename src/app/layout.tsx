"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/provider/theme";
import { DirectionProvider, useDirection } from "@/context/DirectionContext";

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

// Inner component to access the direction context
const InnerRootLayout = ({
  loading,
  children,
}: {
  loading: boolean;
  children: React.ReactNode;
}) => {
  const { direction, toggleDirection } = useDirection();

  return (
    <html lang="en" dir={direction}>
      <body suppressHydrationWarning={true}>
        <ThemeProvider theme={{ ...theme, direction }}>
          <div
            className={`dark:bg-boxdark-2 dark:text-bodydark ${direction === "rtl" ? "rtl" : "ltr"}`}
          >
            {loading ? <Loader /> : children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
};
