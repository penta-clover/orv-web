"use client";

import * as amplitude from "@amplitude/analytics-browser";
import Script from "next/script";
import React from "react";
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

  const scripts = [];

  if (process.env.NEXT_PUBLIC_GA_TRACKING_ENABLED === "true") {
    scripts.push(
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
    );
  }

  if (process.env.NEXT_PUBLIC_SMARTLOOK_TRACKING_ENABLED === "true") {
    scripts.push(
      <Script type="text/javascript" strategy="afterInteractive">
        {`window.smartlook||(function(d) {
        var o=smartlook=function(){ o.api.push(arguments)},h=d.getElementsByTagName('head')[0];
        var c=d.createElement('script');o.api=new Array();c.async=true;c.type='text/javascript';
        c.charset='utf-8';c.src='https://web-sdk.smartlook.com/recorder.js';h.appendChild(c);
        })(document);
        smartlook('init', '971a90886549384a73f2e6d776aed58357d080fa', { region: 'eu' });
      `}
      </Script>
    );
  }

  return <>{
    scripts.map((script, index) => (
      <React.Fragment key={index}>{script}</React.Fragment>
    ))
  }</>
}
