"use client";

import React, { useEffect, useImperativeHandle, useRef } from "react";

interface SubtitleCanvasProps {
  sourceCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  subtitles: Subtitle[];
  fps?: number;
  className?: string;
  style?: React.CSSProperties;
}

interface Subtitle {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
}

const DEFAULT_FPS = 24;

// 기존 캔버스에 자막이 추가된 새로운 캔버스
export const SubtitleCanvas = React.forwardRef<
  HTMLCanvasElement,
  SubtitleCanvasProps
>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const subtitlesRef = useRef<Subtitle[]>([]);
  useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement);

  const { sourceCanvasRef, subtitles, className, style, fps } = props;

  useEffect(() => {
    if (subtitlesRef.current) {
      subtitlesRef.current = subtitles;
    }
  }, [subtitles]);

  // 캔버스 설정
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let frameId: number | null = null;
    const frameInterval = 1000 / (fps || DEFAULT_FPS);

    const drawFrame = () => {
      if (sourceCanvasRef.current) {
        if (
          canvas.width !== sourceCanvasRef.current.width ||
          canvas.height !== sourceCanvasRef.current.height
        ) {
          canvas.width = sourceCanvasRef.current.width;
          canvas.height = sourceCanvasRef.current.height;
        }

        const ctx = canvas?.getContext("2d", {
          alpha: false,
        });

        if (ctx) {
          // 소스 캔버스 그리기
          ctx.drawImage(
            sourceCanvasRef.current,
            0,
            0,
            canvas.width,
            canvas.height
          );

          // 자막 렌더링 품질 설정
          ctx.textRendering = "optimizeLegibility";
          ctx.textBaseline = "middle";

          subtitlesRef.current.forEach((subtitle) => {
            ctx.font = `${subtitle.fontSize}px 'Pretendard Variable', Arial, sans-serif`;
            ctx.fillStyle = subtitle.color;

            const y = subtitle.y + canvas.height;
            ctx.fillText(subtitle.text, subtitle.x, y);
          });
        }
      }

      frameId = window.setTimeout(drawFrame, frameInterval);
    };

    drawFrame();

    return () => {
      if (frameId) {
        window.clearTimeout(frameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        aspectRatio: "16/9",
        objectFit: "cover",
        maxHeight: "100%",
        ...style,
      }}
      className={className}
    />
  );
});
