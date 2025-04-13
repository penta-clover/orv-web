// app/ClientSideComponents.tsx
"use client";

import * as ChannelService from "@channel.io/channel-web-sdk-loader";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Analytics from "./analytics";
import { useEffect } from "react";

export default function ClientSideComponents({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // 클라이언트에서만 실행되는 side-effect
    ChannelService.loadScript();
  }, []);

  return (
    <>
      <Analytics />
      <SpeedInsights />
      {children}
    </>
  );
}
