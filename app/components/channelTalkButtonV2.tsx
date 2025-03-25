import { Children, useEffect } from "react";
import * as ChannelService from "@channel.io/channel-web-sdk-loader";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";

export default function ChannelTalkButton({
  children,
  text,
  className,
}: Readonly<{
  children: React.ReactNode;
  text?: string;
  className?: string;
}>) {
  useEffect(() => {
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
    <button
      className={cn(
        "text-head4 text-system-info underline channel-talk-button",
        className
      )}
    >
      {children}
      {text}
    </button>
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
