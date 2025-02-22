"use client";

import * as amplitude from '@amplitude/analytics-browser';
import Script from "next/script";
import { useEffect } from 'react';

export default function Analytics() {
  // amplitude
  useEffect(() => {
    amplitude.init('15a38dcdf0b5dab274c2a74f5db296e2', {
      autocapture: {
        elementInteractions: true
      }
    });
  }, []);

  return (
    <>
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-VGK4GCEN7R"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){ dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', 'G-VGK4GCEN7R');
        `}
      </Script>
    </>
  );
}
