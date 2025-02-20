"use client";

import { Api } from "@/data/Api";
import { AuthRepositoryImpl } from "@/data/repository/AuthRepositoryImpl";
import { JoinUsecase } from "@/domain/usecase/JoinUsecase";

import "./globals.css";
import { FirebaseProvider } from "@/providers/firebaseContext";
import { EarlybirdRepositoryProvider } from "@/providers/earlybirdRepositoryContext";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orv",
  description: "나를 바라보는 시간",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const api = new Api();
  const authRepository = new AuthRepositoryImpl(api);
  const joinUsecase = new JoinUsecase(authRepository);
  
  return (
    <html lang="ko">
      <body className={`antialiased hide-scrollbar safe-area`}>
        <FirebaseProvider>
          <EarlybirdRepositoryProvider>
            {children}
          </EarlybirdRepositoryProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}
