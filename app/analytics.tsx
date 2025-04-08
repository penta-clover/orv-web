"use client";

import * as amplitude from "@amplitude/analytics-browser";
import Script from "next/script";
import React, { useState } from "react";
import { useEffect } from "react";

// 문서의 쿠키 문자열을 파싱하는 헬퍼 함수
const parseCookies = (): Record<string, string> => {
  return document.cookie.split("; ").reduce((cookies, cookieStr) => {
    const [name, value] = cookieStr.split("=");
    cookies[name] = value;
    return cookies;
  }, {} as Record<string, string>);
};

export default function Analytics() {
  // 각 추적 도구의 활성화 여부
  const [trackingEnabled, setTrackingEnabled] = useState({
    ga: false,
    amplitude: false,
    smartlook: false,
  });

  useEffect(() => {
    const cookies = parseCookies();
    // 환경변수와 쿠키 값에 따라 활성화 여부 결정
    setTrackingEnabled({
      ga:
        process.env.NEXT_PUBLIC_GA_TRACKING_ENABLED === "true" &&
        !cookies["orv-ga-tracking-free"],
      amplitude:
        process.env.NEXT_PUBLIC_AMPLITUDE_TRACKING_ENABLED === "true" &&
        !cookies["orv-amplitude-tracking-free"],
      smartlook:
        process.env.NEXT_PUBLIC_SMARTLOOK_TRACKING_ENABLED === "true" &&
        !cookies["orv-smartlook-tracking-free"],
    });
  }, []);

  // amplitude 초기화
  useEffect(() => {
    if (trackingEnabled.amplitude) {
      amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY as string, {
        autocapture: {
          elementInteractions: true,
        },
      });
    }
  }, [trackingEnabled.amplitude]);

  return (
    <>
      {trackingEnabled.ga && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){ dataLayer.push(arguments); }
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `}
          </Script>
        </>
      )}

      {trackingEnabled.smartlook && (
        <Script id="smartlook-init" strategy="afterInteractive">
          {`
            window.smartlook||(function(d) {
              var o = smartlook=function(){ o.api.push(arguments) },
                  h = d.getElementsByTagName('head')[0],
                  c = d.createElement('script');
              o.api = new Array();
              c.async = true;
              c.type = 'text/javascript';
              c.charset = 'utf-8';
              c.src = 'https://web-sdk.smartlook.com/recorder.js';
              h.appendChild(c);
            })(document);
            smartlook('init', '971a90886549384a73f2e6d776aed58357d080fa', { region: 'eu' });
          `}
        </Script>
      )}
    </>
  );
}
