"use client";

import { TopicRepository } from "@/domain/repository/TopicRepository";
import { ReactNode, createContext, useContext } from "react";
import { useApi } from "./ApiContext";
import { useStorage } from "./StorageContext";
import { TopicRepositoryImpl } from "@/data/repository/TopicRepositoryImpl";

const TopicRepositoryContext = createContext<TopicRepository | null>(null);

interface TopicRepositoryProviderProps {
  children: ReactNode;
}

export function TopicRepositoryProvider({
  children,
}: TopicRepositoryProviderProps) {
  const api = useApi();
  const storage = useStorage();
  const topicRepository = new TopicRepositoryImpl(api, storage);

  return (
    <TopicRepositoryContext.Provider value={topicRepository}>
      {children}
    </TopicRepositoryContext.Provider>
  );
}

export function useTopicRepository(): TopicRepository {
    const context = useContext(TopicRepositoryContext);
    if (!context) throw new Error("Provider가 없어욥!");
    return context;
}
