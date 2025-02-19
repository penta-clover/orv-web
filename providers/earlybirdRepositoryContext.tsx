// EarlybirdRepositoryContext.tsx
import React, { createContext, useContext } from "react";
import { FirebaseApp } from "firebase/app";
import { EarlybirdRepository, IEarlybirdRepository } from "@/repositories/earlybirdRepository";

// 초기값을 null로 설정합니다.
const EarlybirdRepositoryContext = createContext<IEarlybirdRepository | null>(null);

interface EarlybirdRepositoryProviderProps {
  children: React.ReactNode;
  firebaseApp: FirebaseApp;
}

export const EarlybirdRepositoryProvider = ({
  children,
  firebaseApp,
}: EarlybirdRepositoryProviderProps) => {
  // firebaseApp을 이용해 repository 인스턴스를 생성합니다.
  const repository = new EarlybirdRepository(firebaseApp);

  return (
    <EarlybirdRepositoryContext.Provider value={repository}>
      {children}
    </EarlybirdRepositoryContext.Provider>
  );
};

// 커스텀 hook을 만들어 편리하게 repository를 사용할 수 있게 합니다.
export const useEarlybirdRepository = (): IEarlybirdRepository => {
  const context = useContext(EarlybirdRepositoryContext);
  if (!context) {
    throw new Error(
      "useEarlybirdRepository must be used within an EarlybirdRepositoryProvider"
    );
  }
  return context;
};
