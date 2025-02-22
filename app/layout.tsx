"use client";

import "./globals.css";
import { Api } from "@/data/Api";
import { Storage } from "@/data/Storage";
import { AuthRepositoryImpl } from "@/data/repository/AuthRepositoryImpl";
import { FirebaseProvider } from "@/providers/firebaseContext";
import { EarlybirdRepositoryProvider } from "@/providers/earlybirdRepositoryContext";
import Head from "next/head";
import * as ChannelService from "@channel.io/channel-web-sdk-loader";
import { SpeedInsights } from "@vercel/speed-insights/next"

import { AuthService } from "@/domain/service/AuthService";
import { AuthProvider } from "@/context/AuthContext";
import Analytics from "./analytics";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const api = new Api();
  const storage = new Storage();
  const authRepository = new AuthRepositoryImpl(api, storage);
  const authService = new AuthService(authRepository);

  ChannelService.loadScript();

  return (
    <html lang="ko">
      <Head>
        <title>Orv</title>
        <meta name="description" content="나를 바라보는 시간" />
      </Head>
      <body className={`antialiased hide-scrollbar safe-area font-pretendard`}>
        <Analytics />
        <SpeedInsights />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />

        <AuthProvider authService={authService}>
          <FirebaseProvider>
            <EarlybirdRepositoryProvider>
              {children}
            </EarlybirdRepositoryProvider>
          </FirebaseProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
