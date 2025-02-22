"use client";

import { Api } from "@/data/Api";
import { ReactNode, createContext, useContext } from "react";

const ApiContext = createContext<Api | null>(null);

interface ApiProviderProps {
  children: ReactNode;
}

export function ApiProvider({ children }: ApiProviderProps) {
  const api = new Api();
  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

export function useApi(): Api {
  const context = useContext(ApiContext);
  if (!context) throw new Error("Provider가 없어욥!");
  return context;
}
