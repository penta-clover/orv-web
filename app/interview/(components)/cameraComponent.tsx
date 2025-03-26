"use client";

import React, { useEffect, useImperativeHandle, useRef } from "react";

interface CameraComponentProps {
  filter?: Filter;
  afterDraw?: (ctx: CanvasRenderingContext2D) => void;
}

// CameraComponent를 forwardRef로 감싸서 외부에서 canvas 엘리먼트를 참조할 수 있도록 합니다.
export const CameraComponent = React.forwardRef<
  HTMLCanvasElement,
  CameraComponentProps
>((props, ref) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const currentFilterRef = useRef<Filter | undefined>(props.filter);
  const afterDrawRef = useRef<
    ((ctx: CanvasRenderingContext2D) => void) | undefined
  >(props.afterDraw);

  useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement);

  // 값 변경시마다 ref 업데이트
  useEffect(() => {
    currentFilterRef.current = props.filter;
  }, [props.filter]);

  useEffect(() => {
    afterDrawRef.current = props.afterDraw;
  }, [props.afterDraw]);

  // 카메라 설정
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.mediaDevices) {
      const enableCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              // HD 해상도 적용
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: true,
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

  // 캔버스 설정
  useEffect(() => {
    const video = localVideoRef.current;
    const canvas = canvasRef.current;
    const preview = previewRef.current;

    // willReadFrequently가 들어가면 GPU가 아닌 CPU에서 렌더링을 하는데,
    // 그러면 fetch가 우선 순위에 밀려서 딜레이가 생기므로 켜지 않음
    const ctx = canvas?.getContext("2d");
    const previewCtx = preview?.getContext("2d");

    if (!video || !canvas || !ctx || !preview || !previewCtx) return;

    const drawFrame = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        preview.width = video.videoWidth;
        preview.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const currentFilter = currentFilterRef.current;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // 필터가 적용된 경우에만 픽셀 데이터 수정
        if (currentFilter && currentFilter !== "default") {
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            switch (currentFilter) {
              case "grayscale":
                const gray = (r + g + b) / 3;
                data[i] = gray;
                data[i + 1] = gray;
                data[i + 2] = gray;
                break;
              case "warm":
                data[i] = Math.min(255, r * 1.2); // 빨간색 강화
                data[i + 1] = Math.min(255, g * 1.1); // 초록색 약간 강화
                break;
              case "cold":
                data[i] = Math.max(0, r * 0.8); // 빨간색 감소
                data[i + 2] = Math.min(255, b * 1.2); // 파란색 강화
                break;
              case "bright":
                data[i] = Math.min(255, r * 1.2);
                data[i + 1] = Math.min(255, g * 1.2);
                data[i + 2] = Math.min(255, b * 1.2);
                break;
              case "dark":
                data[i] = Math.max(0, r * 0.8);
                data[i + 1] = Math.max(0, g * 0.8);
                data[i + 2] = Math.max(0, b * 0.8);
                break;
            }
          }
        }

        // 수정된 이미지 데이터를 canvas에 그리기
        ctx.putImageData(imageData, 0, 0);
        previewCtx.putImageData(imageData, 0, 0);

        if (afterDrawRef.current) {
          afterDrawRef.current(ctx);
        }
      }

      animationFrameRef.current = requestAnimationFrame(drawFrame);
    };

    // 비디오가 로드되면 그리기 시작
    video.onloadedmetadata = () => {
      drawFrame();
    };

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: "0",
          height: "0",
          position: "absolute",
          opacity: "0",
          pointerEvents: "none",
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          width: "0",
          height: "0",
          position: "absolute",
          opacity: "0",
          pointerEvents: "none",
        }}
      />
      <canvas
        ref={previewRef}
        style={{
          width: "100%",
          aspectRatio: "16/9",
          objectFit: "cover",
          maxHeight: "100%",
        }}
      />
    </div>
  );
});
