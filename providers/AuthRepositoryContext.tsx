"use client";

import { ReactNode, createContext, useContext } from "react";
import { AuthRepository } from "@/domain/repository/AuthRepository";
import { useApi } from "./ApiContext";
import { useStorage } from "./StorageContext";
import { AuthRepositoryImpl } from "@/data/repository/AuthRepositoryImpl";

const AuthRepositoryContext = createContext<AuthRepository | null>(null);

interface AuthRepositoryProviderProps {
  children: ReactNode;
}

export function AuthRepositoryProvider({
  children,
}: AuthRepositoryProviderProps) {
  const api = useApi();
  const storage = useStorage();
  const authRepository = new AuthRepositoryImpl(api, storage);

  return (
    <AuthRepositoryContext.Provider value={authRepository}>
      {children}
    </AuthRepositoryContext.Provider>
  );
}

export function useAuthRepository(): AuthRepository {
  const context = useContext(AuthRepositoryContext);
  if (!context) throw new Error("Provider가 없어욥!");
  return context;
}
