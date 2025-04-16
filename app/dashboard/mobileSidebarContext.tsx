"use client";

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

const MobileSidebarContext = createContext<{
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
} | null>(null);

export function MobileSidebarProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <MobileSidebarContext.Provider
      value={{ isSidebarOpen, toggleSidebar, setIsSidebarOpen }}
    >
      {children}
    </MobileSidebarContext.Provider>
  );
}

export function useMobileSidebar() {
  return useContext(MobileSidebarContext);
}
