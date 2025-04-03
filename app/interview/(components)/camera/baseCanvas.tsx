"use client";

import React, { useImperativeHandle, useRef } from "react";

export interface BaseCanvasProps {
  className?: string;
  style?: React.CSSProperties;
}

export const BaseCanvas = React.forwardRef<HTMLCanvasElement, BaseCanvasProps>(
  (props, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement);

    return (
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          aspectRatio: "16/9",
          objectFit: "cover",
          maxHeight: "100%",
          ...props.style,
        }}
        className={props.className}
      />
    );
  }
);
