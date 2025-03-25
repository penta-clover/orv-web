"use client";

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

const SidebarContext = createContext<{
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
} | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <SidebarContext.Provider
      value={{ isSidebarOpen, toggleSidebar, setIsSidebarOpen }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
