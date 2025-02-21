"use client";

import "./globals.css";
import { Api } from "@/data/Api";
import { AuthRepositoryImpl } from "@/data/repository/AuthRepositoryImpl";
import { FirebaseProvider } from "@/providers/firebaseContext";
import { EarlybirdRepositoryProvider } from "@/providers/earlybirdRepositoryContext";
import Head from "next/head";
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
      <Head>
        <title>Orv</title>
        <meta name="description" content="나를 바라보는 시간" />
      </Head>
      <body className={`antialiased hide-scrollbar safe-area font-pretendard`}>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />

        <JoinProvider joinService={joinService}>
          <FirebaseProvider>
            <EarlybirdRepositoryProvider>
              {children}
            </EarlybirdRepositoryProvider>
          </FirebaseProvider>
        </JoinProvider>
      </body>
    </html>
  );
}
