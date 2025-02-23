"use client";

import * as amplitude from "@amplitude/analytics-browser";
import Script from "next/script";
import { useEffect } from "react";

export default function Analytics() {
  // amplitude
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_AMPLITUDE_TRACKING_ENABLED === "true") {
      amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY as string, {
        autocapture: {
          elementInteractions: true,
        },
      });
    }
  }, []);

  return process.env.NEXT_PUBLIC_GA_TRACKING_ENABLED === "true" ? (
    // google analytics
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
  ) : null;
}
