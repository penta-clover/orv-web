"use client";

import React, { useEffect, useImperativeHandle, useRef } from "react";

// CameraComponent를 forwardRef로 감싸서 외부에서 video 엘리먼트를 참조할 수 있도록 합니다.
export const CameraComponent = React.forwardRef<HTMLVideoElement>((props, ref) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);

  useImperativeHandle(ref, () => localVideoRef.current as HTMLVideoElement);

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.mediaDevices) {
      const enableCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error("카메라를 활성화하는 도중 에러 발생:", error);
        }
      };

      enableCamera();
    }
  }, []);

  return (
    <video
      ref={localVideoRef}
      autoPlay
      playsInline
      style={{
        width: "100%",
        aspectRatio: "16/9",
        objectFit: "cover",
      }}
    />
  );
});
