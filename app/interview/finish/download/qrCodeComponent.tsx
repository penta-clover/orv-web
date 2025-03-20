"use client";

import React from "react";
import QRCode from "react-qr-code";

export default function QRCodeComponent(props: {url: string}) {
  
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <QRCode value={props.url} size={144} />
      <p className="mt-2 text-white">{props.url}</p>
    </div>
  );
}
