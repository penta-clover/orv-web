import { useEffect } from "react";
import { BaseCanvas, BaseCanvasProps } from "./baseCanvas";
import React from "react";

interface BlankCanvasProps extends BaseCanvasProps {
  ref: React.RefObject<HTMLCanvasElement | null>;
  overlay?: string;
}

export function BlankCanvas(props: BlankCanvasProps) {
  const { ref, overlay, className, style } = props;

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    ctx.fillStyle = "#1A1B1E";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (overlay) {
      const overlayImage = new Image();
      overlayImage.src = overlay;
      overlayImage.onload = () => {
        ctx.drawImage(overlayImage, 0, 0, canvas.width, canvas.height);
      };
    }
  }, [overlay]);

  return <BaseCanvas ref={ref} className={className} style={style} />;
}
