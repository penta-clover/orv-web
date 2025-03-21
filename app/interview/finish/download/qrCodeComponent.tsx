"use client";

import React from "react";
import QRCode from "react-qr-code";

export default function QRCodeComponent(props: {url: string}) {
  
  return (
    <div className="flex flex-col items-center justify-center bg-grayscale-white p-[15px]">
      <QRCode value={props.url} size={114} />
    </div>
  );
}
