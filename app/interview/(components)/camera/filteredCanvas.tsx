import React, { useEffect, useImperativeHandle, useRef } from "react";
import { WebGLRenderer } from "./webglRenderer";
import { BaseCanvas, BaseCanvasProps } from "./baseCanvas";

interface FilteredCanvasProps extends BaseCanvasProps {
  source?: Source | null;
  filter?: Filter;
  overlay?: string;
}

export const FilteredCanvas = React.forwardRef<
  HTMLCanvasElement,
  FilteredCanvasProps
>((props, ref) => {
  const { source, filter = "default", overlay, className, style } = props;
  const sourceRef = useRef<Source | null | undefined>(null);
  const filterRef = useRef<FilterData>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameId = useRef<number | null>(null);

  useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement);

  // Ref 쓰는 이유: 무한 재귀 도는 함수에 간섭할 수 있는 방법이 이거밖에 없음 ㅜㅜ
  useEffect(() => {
    filterRef.current = getFilterUniforms(filter);
  }, [filter]);

  useEffect(() => {
    sourceRef.current = source;
  }, [source]);

  useEffect(() => {
    filterRef.current = getFilterUniforms(filter);

    // WebGL 컨텍스트 초기화
    if (!canvasRef.current) {
      console.error("Canvas element not found");
      return;
    }

    const gl = canvasRef.current.getContext("webgl", {
      preserveDrawingBuffer: true, // canvas 복사를 위한 buffer 보존
      powerPreference: "high-performance", // 성능 최적화
      antialias: false, // 안티아일리어싱 비활성화
      depth: false, // 깊이 버퍼 비활성화
      stencil: false, // 스텐실 버퍼 비활성화
      alpha: false, // 알파 버퍼 비활성화
      desynchronized: true, // 비동기 렌더링 활성화
    });
    if (!gl) {
      console.error("WebGL not supported in this browser");
      return;
    }

    const webglRenderer = new WebGLRenderer(gl);
    webglRenderer.init();

    if (overlay) {
      const overlayImage = new Image();
      overlayImage.src = overlay;
      overlayImage.onload = () => {
        webglRenderer.setOverlay(overlayImage);
      };
    }

    const drawFrame = () => {
      if (sourceRef.current && canvasRef.current) {
        if (
          sourceRef.current.width !== canvasRef.current.width ||
          sourceRef.current.height !== canvasRef.current.height
        ) {
          canvasRef.current.width = sourceRef.current.width;
          canvasRef.current.height = sourceRef.current.height;
          gl.viewport(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
        webglRenderer.draw(sourceRef.current, filterRef.current!);
      }
      requestAnimationFrame(drawFrame);
    };

    const cleanup = () => {
      webglRenderer.cleanup();
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
        frameId.current = null;
      }
    };

    drawFrame();

    return () => cleanup();
  }, []);

  return <BaseCanvas ref={canvasRef} className={className} style={style} />;
});

function getFilterUniforms(filter: Filter) {
  switch (filter) {
    case "bright":
      return {
        brightness: 1.2,
        contrast: 1.0,
        saturation: 1.0,
      };
    case "monotone": {
      return {
        brightness: 1.1,
        contrast: 0.9,
        saturation: 0.0,
      };
    }
    case "natural":
      return {
        brightness: 1.05,
        contrast: 1.05,
        saturation: 1.0,
      };
    case "soft":
      return {
        brightness: 1.1,
        contrast: 0.85,
        saturation: 1.1,
      };
    case "lark":
      return {
        brightness: 1.15,
        contrast: 0.95,
        saturation: 0.8,
      };
    case "grayscale":
      return {
        brightness: 1.0,
        contrast: 1.0,
        saturation: 0.0,
      };
    case "warm":
      return {
        brightness: 1.1,
        contrast: 1.0,
        saturation: 1.2,
      };
    case "cold":
      return {
        brightness: 0.9,
        contrast: 1.0,
        saturation: 0.8,
      };
    case "dark":
      return {
        brightness: 0.8,
        contrast: 1.0,
        saturation: 1.0,
      };
    default:
      return {
        brightness: 1.0,
        contrast: 1.0,
        saturation: 1.0,
      };
  }
}
