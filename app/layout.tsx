"use client";

import "./globals.css";
import { Api } from "@/data/Api";
import { AuthRepositoryImpl } from "@/data/repository/AuthRepositoryImpl";
import { JoinService } from "@/domain/service/JoinService";
import { JoinProvider } from "@/context/JoinContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const api = new Api();
  const authRepository = new AuthRepositoryImpl(api);
  const joinService = new JoinService(authRepository);
  
  return (
    <html lang="ko">
      <body className={`antialiased overflow-hidden safe-area`}>
        <JoinProvider joinService={joinService}>
          {children}
        </JoinProvider>
      </body>
    </html>
  );
}
