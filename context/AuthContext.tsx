"use client";

import { ReactNode, createContext, useContext } from "react";
import { AuthService } from "@/domain/service/AuthService";

type AuthContextType = {
  authService: AuthService
};

type AuthProviderProps = {
  authService: AuthService,
  children: ReactNode
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ authService, children }: AuthProviderProps) { 
  return (
    <AuthContext.Provider value={{ authService }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext() { 
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("Provider가 없어욥!");
  return context;
}