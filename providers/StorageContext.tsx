"use client";

import { Storage } from "@/data/Storage";
import { ReactNode, createContext, useContext } from "react";

const StorageContext = createContext<Storage | null>(null);

interface StorageProviderProps {
  children: ReactNode;
}

export function StorageProvider({ children }: StorageProviderProps) {
  const storage = new Storage();
  return <StorageContext.Provider value={storage}>{children}</StorageContext.Provider>;
}

export function useStorage(): Storage {
  const context = useContext(StorageContext);
  if (!context) throw new Error("Provider가 없어욥!");
  return context;
}
