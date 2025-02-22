'use client';

import React, { createContext, useContext } from "react";
import { FirebaseApp } from "firebase/app";
import { EarlybirdRepository } from "@/domain/repository/EarlybirdRepository";
import { EarlybirdRepositoryImpl } from "@/data/repository/EarlybirdRepositoryImpl";
import { useFirebase } from "@/providers/FirebaseContext";

// 초기값을 null로 설정합니다.
const EarlybirdRepositoryContext = createContext<EarlybirdRepository | null>(null);

interface EarlybirdRepositoryProviderProps {
  children: React.ReactNode;
}

export const EarlybirdRepositoryProvider = ({
  children,
}: EarlybirdRepositoryProviderProps) => {
  // 본 Provider가 FirebaseProvider 내부에 위치해 함.
  const firebaseApp: FirebaseApp = useFirebase();

  const repository = new EarlybirdRepositoryImpl(firebaseApp);

  return (
    <EarlybirdRepositoryContext.Provider value={repository}>
      {children}
    </EarlybirdRepositoryContext.Provider>
  );
};

export const useEarlybirdRepository = (): EarlybirdRepository => {
  const context = useContext(EarlybirdRepositoryContext);
  if (!context) {
    throw new Error(
      "useEarlybirdRepository must be used within an EarlybirdRepositoryProvider"
    );
  }
  return context;
};
