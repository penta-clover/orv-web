"use client";

import "./globals.css";
import Head from "next/head";

import * as ChannelService from "@channel.io/channel-web-sdk-loader";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Providers from "./providers";
import Analytics from "./analytics";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  ChannelService.loadScript();

  return (
    <html lang="ko">
      <Head>
        <title>나를 마주하는 시간 오브</title>
        <meta name="description" content="나를 마주할 기회를 선물하는 곳" />

        <meta property="og:title" content="오브 Orv" />
        <meta property="og:description" content="나를 마주할 기회를 선물하는 곳" />
        <meta property="og:image" content="/images/orv-og-thumbnail.jpeg" />
        <meta property="og:url" content="www.orv.im" />
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

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
