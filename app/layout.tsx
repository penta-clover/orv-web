"use client";

import "./globals.css";
import Head from "next/head";
import Providers from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
