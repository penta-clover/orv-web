"use client";

import "./globals.css";
import { Api } from "@/data/Api";
import { Storage } from "@/data/Storage";
import { AuthRepositoryImpl } from "@/data/repository/AuthRepositoryImpl";
import { AuthService } from "@/domain/service/AuthService";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const api = new Api();
  const storage = new Storage();
  const authRepository = new AuthRepositoryImpl(api, storage);
  const authService = new AuthService(authRepository);
  
  return (
    <html lang="ko">
      <body className={`antialiased overflow-hidden safe-area`}>
        <AuthProvider authService={authService}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
