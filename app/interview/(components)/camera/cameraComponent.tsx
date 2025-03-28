"use client";

import React, { useEffect, useImperativeHandle, useRef } from "react";

interface CameraComponentProps {
  sourceCanvas?: HTMLCanvasElement;
  drawOver?: (ctx: CanvasRenderingContext2D) => void;
  overlaySrc?: string;
}

export const CameraComponent = React.forwardRef<
  HTMLCanvasElement,
  CameraComponentProps
>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawOverRef = useRef<(ctx: CanvasRenderingContext2D) => void>(null);
  const overlayRef = useRef<HTMLImageElement>(null);
  useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement);

  useEffect(() => {
    if (!props.sourceCanvas) return;
    sourceCanvasRef.current = props.sourceCanvas;
  }, [props.sourceCanvas]);

  useEffect(() => {
    if (!props.overlaySrc) return;
    overlayRef.current = new Image();
    overlayRef.current.src = props.overlaySrc;
  }, [props.overlaySrc]);

  useEffect(() => {
    if (!props.drawOver) return;
    drawOverRef.current = props.drawOver;
  }, [props.drawOver]);

  // 캔버스 설정
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    const drawFrame = () => {
      if (sourceCanvasRef.current) {
        canvas.width = sourceCanvasRef.current.width;
        canvas.height = sourceCanvasRef.current.height;

        ctx.drawImage(
          sourceCanvasRef.current,
          0,
          0,
          canvas.width,
          canvas.height
        );

        if (overlayRef.current) {
          ctx.drawImage(overlayRef.current, 0, 0, canvas.width, canvas.height);
        }

        drawOverRef.current?.(ctx);
      }
      requestAnimationFrame(drawFrame);
    };

    drawFrame();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        aspectRatio: "16/9",
        objectFit: "cover",
        maxHeight: "100%",
      }}
    />
  );
});
