"use client";

import React, { useEffect, useImperativeHandle, useRef } from "react";
import { BaseCanvas, BaseCanvasProps } from "./baseCanvas";

interface SubtitleCanvasProps extends BaseCanvasProps {
  source?: Source | null;
  subtitles: Subtitle[];
  fps?: number;
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
  const sourceRef = useRef<Source | null | undefined>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const subtitlesRef = useRef<Subtitle[]>([]);
  useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement);

  const { source, subtitles, fps, className, style } = props;

  // Ref 쓰는 이유: 무한 재귀 도는 함수에 간섭할 수 있는 방법이 이거밖에 없음 ㅜㅜ
  useEffect(() => {
    if (subtitlesRef.current) {
      subtitlesRef.current = subtitles;
    }
  }, [subtitles]);

  useEffect(() => {
    sourceRef.current = source;
  }, [source]);

  // 캔버스 설정
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let frameId: number | null = null;
    const frameInterval = 1000 / (fps || DEFAULT_FPS);

    const drawFrame = () => {
      if (sourceRef.current && canvas) {
        if (
          canvas.width !== sourceRef.current.width ||
          canvas.height !== sourceRef.current.height
        ) {
          canvas.width = sourceRef.current.width;
          canvas.height = sourceRef.current.height;
        }

        const ctx = canvas.getContext("2d", {
          alpha: false,
        });

        if (ctx) {
          // 소스 캔버스 그리기
          ctx.drawImage(sourceRef.current, 0, 0, canvas.width, canvas.height);

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

  return <BaseCanvas ref={canvasRef} className={className} style={style} />;
});
