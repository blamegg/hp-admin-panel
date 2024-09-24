// DirectionContext.tsx
import React, { createContext, useContext, useState } from "react";

// Create the context
const DirectionContext = createContext<
  | {
      direction: "ltr" | "rtl";
      toggleDirection: () => void;
    }
  | undefined
>(undefined);

// Create a provider component
export const DirectionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");

  const toggleDirection = () => {
    setDirection((prev) => (prev === "ltr" ? "rtl" : "ltr"));
  };

  return (
    <DirectionContext.Provider value={{ direction, toggleDirection }}>
      {children}
    </DirectionContext.Provider>
  );
};

// Create a custom hook to use the DirectionContext
export const useDirection = () => {
  const context = useContext(DirectionContext);
  if (!context) {
    throw new Error("useDirection must be used within a DirectionProvider");
  }
  return context;
};
