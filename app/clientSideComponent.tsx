"use client";

import * as ChannelService from "@channel.io/channel-web-sdk-loader";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { v4 as uuidv4 } from "uuid";
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

    let cookie = getCookie("channel-talk-temp-id");

    if (!cookie) {
      cookie = uuidv4();
      setCookie("channel-talk-temp-id", cookie, 7);
    }

    ChannelService.boot({
      pluginKey: "70a5c12a-ebe9-4acb-861c-1cb90ca98256",
      customLauncherSelector: ".channel-talk-button",
      hideChannelButtonOnBoot: true,
      memberId: cookie,
    });
  }, []);

  return (
    <>
      <Analytics />
      <SpeedInsights />
      {children}
    </>
  );
}

function setCookie(name: string, value: string, days: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// 쿠키 가져오기 함수
function getCookie(name: string) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
