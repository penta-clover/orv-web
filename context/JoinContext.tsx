"use client";

import { ReactNode, createContext, useContext } from "react";
import { JoinService } from "@/domain/service/JoinService";

type JoinContextType = {
  joinService: JoinService
};

type JoinProviderProps = {
  joinService: JoinService,
  children: ReactNode
};

const JoinContext = createContext<JoinContextType | undefined>(undefined);

export function JoinProvider({ joinService, children }: JoinProviderProps) { 
  return (
    <JoinContext.Provider value={{ joinService }}>
      {children}
    </JoinContext.Provider>
  );
};

export function useJoinContext() { 
  const context = useContext(JoinContext);
  if (context === undefined) throw new Error("Provider가 없어욥!");
  return context;
}