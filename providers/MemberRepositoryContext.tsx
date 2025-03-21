"use client";

import { ReactNode, createContext, useContext } from "react";
import { MemberRepository } from "@/domain/repository/MemberRepository";
import { useApi } from "./ApiContext";
import { useStorage } from "./StorageContext";
import { MemberRepositoryImpl } from "@/data/repository/MemberRepositoryImpl";

const MemberRepositoryContext = createContext<MemberRepository | null>(null);

interface MemberRepositoryProviderProps {
  children: ReactNode;
}

export function MemberRepositoryProvider({
  children,
}: MemberRepositoryProviderProps) {
  const api = useApi();
  const storage = useStorage();
  const memberRepository = new MemberRepositoryImpl(api, storage);

  return (
    <MemberRepositoryContext.Provider value={memberRepository}>
      {children}
    </MemberRepositoryContext.Provider>
  );
}

export function useMemberRepository(): MemberRepository {
  const context = useContext(MemberRepositoryContext);
  if (!context) throw new Error("Provider가 없어욥!");
  return context;
}
