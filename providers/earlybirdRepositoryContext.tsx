'use client';

import React, { createContext, useContext } from "react";
import { FirebaseApp } from "firebase/app";
import { EarlybirdRepository } from "@/domain/repository/EarlybirdRepository";
import { EarlybirdRepositoryImpl } from "@/data/repository/EarlybirdRepositoryImpl";
import { useFirebase } from "@/providers/firebaseContext";

// 초기값을 null로 설정합니다.
const EarlybirdRepositoryContext = createContext<EarlybirdRepository | null>(null);

interface EarlybirdRepositoryProviderProps {
  children: React.ReactNode;
}

export const EarlybirdRepositoryProvider = ({
  children,
}: EarlybirdRepositoryProviderProps) => {
  // FirebaseProvider 내부에 있으므로 안전하게 useFirebase()를 호출할 수 있습니다.
  const firebaseApp: FirebaseApp = useFirebase();

  // firebaseApp을 이용해 repository 인스턴스를 생성합니다.
  const repository = new EarlybirdRepositoryImpl(firebaseApp);

  return (
    <EarlybirdRepositoryContext.Provider value={repository}>
      {children}
    </EarlybirdRepositoryContext.Provider>
  );
};

// 커스텀 hook을 만들어 편리하게 repository를 사용할 수 있게 합니다.
export const useEarlybirdRepository = (): EarlybirdRepository => {
  const context = useContext(EarlybirdRepositoryContext);
  if (!context) {
    throw new Error(
      "useEarlybirdRepository must be used within an EarlybirdRepositoryProvider"
    );
  }
  return context;
};
