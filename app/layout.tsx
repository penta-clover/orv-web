import type { Metadata } from "next";
import "./globals.css";
import { FirebaseProvider, useFirebase } from "@/providers/FirebaseContext";
import { EarlybirdRepositoryProvider } from "@/providers/EarlybirdRepositoryContext";

import { Api } from "@/data/Api";
import { AuthRepositoryImpl } from "@/data/repository/AuthRepositoryImpl";
import { JoinUsecase } from "@/domain/usecase/JoinUsecase";

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
          <EarlybirdRepositoryProvider firebaseApp={useFirebase()}>
            {children}
          </EarlybirdRepositoryProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}
