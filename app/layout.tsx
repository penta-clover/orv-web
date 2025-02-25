"use client";

import "./globals.css";

import * as ChannelService from "@channel.io/channel-web-sdk-loader";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Providers from "./providers";
import Analytics from "./analytics";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  ChannelService.loadScript();

  return (
    <html lang="ko">
      <title>나를 마주하는 시간 오브</title>
      <meta name="description" content="나를 마주할 기회를 선물하는 곳" />

      <meta property="og:title" content="오브 Orv" />
      <meta
        property="og:description"
        content="나를 마주할 기회를 선물하는 곳"
      />
      <meta property="og:image" content="/images/orv-og-thumbnail.jpeg" />
      <meta property="og:url" content="www.orv.im" />
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

        <Script type="text/javascript" strategy="afterInteractive">
          {`window.smartlook||(function(d) {
            var o=smartlook=function(){ o.api.push(arguments)},h=d.getElementsByTagName('head')[0];
            var c=d.createElement('script');o.api=new Array();c.async=true;c.type='text/javascript';
            c.charset='utf-8';c.src='https://web-sdk.smartlook.com/recorder.js';h.appendChild(c);
            })(document);
            smartlook('init', '971a90886549384a73f2e6d776aed58357d080fa', { region: 'eu' });
          `}
        </Script>
      </body>
    </html>
  );
}
