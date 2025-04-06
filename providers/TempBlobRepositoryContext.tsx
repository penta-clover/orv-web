'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { TempBlobRepository } from '@/domain/model/TempBlobRepository';
import { TempBlobRepositoryImpl } from '@/data/repository/TempBlobRepositoryImpl';

// Repository 인스턴스 생성 (싱글톤처럼 사용)
const tempBlobRepositoryInstance = new TempBlobRepositoryImpl();

// Context 생성
const TempBlobRepositoryContext = createContext<TempBlobRepository | undefined>(
  undefined
);

// Provider 컴포넌트 생성
export function TempBlobRepositoryProvider({ children }: { children: ReactNode }) {
  return (
    <TempBlobRepositoryContext.Provider value={tempBlobRepositoryInstance}>
      {children}
    </TempBlobRepositoryContext.Provider>
  );
}

// Context를 사용하기 위한 커스텀 훅
export function useTempBlobRepository(): TempBlobRepository {
  const context = useContext(TempBlobRepositoryContext);
  if (context === undefined) {
    throw new Error(
      'useTempBlobRepository must be used within a TempBlobRepositoryProvider'
    );
  }
  return context;
} 