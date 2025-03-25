import { StoryBoardRepository } from "@/domain/repository/StoryboardRepository";
import { StoryboardRepositoryImpl } from "@/data/repository/StoryboardRepositoryImpl";
import { createContext, ReactNode, useContext } from "react";
import { useApi } from "./ApiContext";
import { useStorage } from "./StorageContext";

const StoryboardRepositoryContext = createContext<StoryBoardRepository | null>(
  null
);

export function StoryboardRepositoryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const api = useApi();
  const storage = useStorage();
  const storyboardRepository = new StoryboardRepositoryImpl(api, storage);

  return (
    <StoryboardRepositoryContext.Provider value={storyboardRepository}>
      {children}
    </StoryboardRepositoryContext.Provider>
  );
}

export function useStoryboardRepository(): StoryBoardRepository {
  const context = useContext(StoryboardRepositoryContext);
  if (!context) {
    throw new Error("StoryboardRepositoryContext not found");
  }
  return context;
}
