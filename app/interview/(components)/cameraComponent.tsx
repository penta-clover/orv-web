"use client";

import React, { useEffect, useImperativeHandle, useRef } from "react";

interface CameraComponentProps {
  filter?: Filter;
  afterDraw?: (ctx: CanvasRenderingContext2D) => void;
  test?: string;
}

// CameraComponent를 forwardRef로 감싸서 외부에서 video 엘리먼트를 참조할 수 있도록 합니다.
export const CameraComponent = React.forwardRef<
  HTMLCanvasElement,
  CameraComponentProps
>((props, ref) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const currentFilterRef = useRef<Filter | undefined>(props.filter);
  const afterDrawRef = useRef<
    ((ctx: CanvasRenderingContext2D) => void) | undefined
  >(props.afterDraw); // 일단 ref로 하니까 되긴 하는데, 저장하는 양이 커서 좀 더 좋은 방법 찾아야 함

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
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });

    if (!video || !canvas || !ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const drawFrame = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const currentFilter = currentFilterRef.current;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.filter
        const data = imageData.data;

        // 필터가 적용된 경우에만 픽셀 데이터 수정
        if (currentFilter && currentFilter !== "default") {
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // 얘 밖으로 빼니까 확실히 딜레이가 느껴져서, 더럽지만 여기다가 작성함..
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

        // 좌우 반전 적용... 인데 더 나은 방법 없을까 ㅠㅠ
        createImageBitmap(imageData).then((imageBitmap) => {
          console.log(ctx);
          ctx.scale(-1, 1);
          ctx.translate(-canvas.width, 0);
          ctx.drawImage(imageBitmap, 0, 0);

          if (afterDrawRef.current) {
            ctx.scale(-1, 1);
            ctx.translate(-canvas.width, 0);
            afterDrawRef.current(ctx);
          }
        });
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
          width: "100%",
          aspectRatio: "16/9",
          objectFit: "cover",
          maxHeight: "100%",
        }}
      />
    </div>
  );
});
