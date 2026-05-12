"use client";

import { StoryboardRepository } from "@/domain/repository/StoryboardRepository";
import { createContext, ReactNode, useContext } from "react";
import { useApi } from "./ApiContext";
import { StoryboardRepositoryImpl } from "@/data/repository/StoryboardRepositoryImpl";

const StoryboardRepositoryContext = createContext<StoryboardRepository | null>(null);

interface StoryboardRepositoryProviderProps {
    children: ReactNode;
}

export function StoryboardRepositoryProvider({
    children,
}: StoryboardRepositoryProviderProps) {
    const api = useApi();
    const storyboardRepository = new StoryboardRepositoryImpl(api);

    return (
        <StoryboardRepositoryContext.Provider value={storyboardRepository}>
            {children}
        </StoryboardRepositoryContext.Provider>
    )
}

export function useStoryboardRepository(): StoryboardRepository {
    const context = useContext(StoryboardRepositoryContext);
    if (!context) throw new Error("Provider가 없어욥!");
    return context;
}
