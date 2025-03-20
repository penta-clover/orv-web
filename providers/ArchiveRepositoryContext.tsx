"use client";

import { ArchiveRepository } from "@/domain/repository/ArchiveRepository";
import { ReactNode, createContext, useContext } from "react";
import { useApi } from "./ApiContext";
import { useStorage } from "./StorageContext";
import { ArchiveRepositoryImpl } from "@/data/repository/ArchiveRepositoryImpl";

const ArchiveRepositoryContext = createContext<ArchiveRepository | null>(null);

interface ArchiveRepositoryProviderProps {
  children: ReactNode;
}

export function ArchiveRepositoryProvider({
  children,
}: ArchiveRepositoryProviderProps) {
  const api = useApi();
  const storage = useStorage();
  const archiveRepository = new ArchiveRepositoryImpl(api, storage);

  return (
    <ArchiveRepositoryContext.Provider value={archiveRepository}>
      {children}
    </ArchiveRepositoryContext.Provider>
  );
}

export function useArchiveRepository(): ArchiveRepository {
  const context = useContext(ArchiveRepositoryContext);
  if (!context) throw new Error("Provider가 없어욥!");
  return context;
}
