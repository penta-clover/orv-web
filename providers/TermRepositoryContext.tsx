"use client";

import { TermRepository } from "@/domain/repository/TermRepository";
import { createContext, ReactNode, useContext } from "react";
import { useApi } from "./ApiContext";
import { useStorage } from "./StorageContext";
import { TermRepositoryImpl } from "@/data/repository/TermRepositoryImpl";

const TermRepositoryContext = createContext<TermRepository | null>(null);

interface TermRepositoryProviderProps {
    children: ReactNode;
}

export function TermRepositoryProvider({
    children,
}: TermRepositoryProviderProps) {
    const api = useApi();
    const storage = useStorage();
    const termRepository = new TermRepositoryImpl(api, storage);

    return (
        <TermRepositoryContext.Provider value={termRepository}>
            {children}
        </TermRepositoryContext.Provider>
    )
}

export function useTermRepository(): TermRepository {
    const context = useContext(TermRepositoryContext);
    if (!context) throw new Error("Provider가 없어욥!");
    return context;
}