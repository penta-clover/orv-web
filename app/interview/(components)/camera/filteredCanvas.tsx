import React, { useEffect, useImperativeHandle, useRef } from "react";
import { WebGLRenderer } from "./webglRenderer";

interface FilteredCanvasProps {
  stream?: MediaStream;
  filter?: Filter;
  overlay?: string;
  className?: string;
  style?: React.CSSProperties;
  resolution?: { widthPixel: number; heightPixel: number };
}

export const FilteredCanvas = React.forwardRef<
  HTMLCanvasElement,
  FilteredCanvasProps
>((props, ref) => {
  const {
    stream,
    filter = "default",
    overlay,
    style,
    className,
    resolution,
  } = props;
  const filterRef = useRef<FilterData>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement);

  useEffect(() => {
    if (!stream) return;

    // 비디오 요소 생성 및 설정
    const video = document.createElement("video");
    video.srcObject = stream;
    video.autoplay = true;
    video.playsInline = true;
    video.muted = true;
    video.style.width = `${resolution?.widthPixel ?? 1280}px`;
    video.style.height = `${resolution?.heightPixel ?? 720}px`;
    video.style.position = "fixed";
    video.style.top = "0";
    video.style.left = "0";
    video.style.opacity = "0.001";
    video.style.transform = "scale(0.1)"; // 비디오 요소를 화면에서 보이지 않도록 설정
    video.style.pointerEvents = "none"; // 비디오 요소가 클릭 이벤트를 받지 않도록 설정
    video.style.display = "block";
    document.body.appendChild(video);
    video.play().catch((err) => console.log("video.play 실패:", err));

    filterRef.current = getFilterUniforms(filter);

    // WebGL 컨텍스트 초기화
    if (!canvasRef.current) {
      console.error("Canvas element not found");
      return;
    }

    const gl = canvasRef.current.getContext("webgl", {
      preserveDrawingBuffer: true,
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

    // 오프스크린 크롭용 캔버스 재사용
    const offscreenCanvas = document.createElement('canvas');
    const offscreenCtx = offscreenCanvas.getContext('2d')!;

    if (overlay) {
      const overlayImage = new Image();
      overlayImage.src = overlay;
      overlayImage.onload = () => {
        webglRenderer.setOverlay(overlayImage);
      };
    }

    const drawFrame = () => {
      const cvs = canvasRef.current;
      if (!cvs) return;

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // 캔버스 및 비디오 비율 계산
        const vidW = video.videoWidth;
        const vidH = video.videoHeight;
        const cvsW = cvs.width;
        const cvsH = cvs.height;
        const videoRatio = vidW / vidH;
        const canvasRatio = cvsW / cvsH;

        const source: HTMLVideoElement | HTMLCanvasElement = video;

        // WebGL 렌더링
        webglRenderer.draw(source, filterRef.current!);
      }
      
      requestAnimationFrame(drawFrame);
    };

    const cleanup = () => {
      webglRenderer.cleanup();
      video.srcObject = null;
    };

    // 비디오 메타데이터 로드 시 렌더링 시작
    video.onloadedmetadata = () => {
      const cvs = canvasRef.current!;
      if (resolution) {
        cvs.width = resolution.widthPixel;
        cvs.height = resolution.heightPixel;
      } else {
        cvs.width = video.videoWidth;
        cvs.height = video.videoHeight;
      }
      offscreenCanvas.width = cvs.width;
      offscreenCanvas.height = cvs.height;
      gl.viewport(0, 0, cvs.width, cvs.height);

      const vRatio = video.videoWidth / video.videoHeight;
      const cRatio = cvs.width / cvs.height;

      if (Math.abs(vRatio - cRatio) < 1e-3) {
        // 비율 동일 → 크롭 해제
        webglRenderer.setCrop(false, [0, 0, 1, 1]);
      } else if (vRatio > cRatio) {
        // 비디오가 더 넓음 → 좌우 잘라내기
        const w = cRatio / vRatio;          // 남길 영역 폭
        const x = (1 - w) / 2;
        webglRenderer.setCrop(true, [x, 0, w, 1]);
      } else {
        // 비디오가 더 길음 → 상하 잘라내기
        const h = vRatio / cRatio;          // 남길 영역 높이
        const y = (1 - h) / 2;
        webglRenderer.setCrop(true, [0, y, 1, h]);
      }

      drawFrame();
    };

    // 에러 처리
    video.onerror = (error) => {
      console.error("Video error:", error);
      cleanup();
    };

    stream.getTracks().forEach((track) => {
      track.onended = () => cleanup();
    });

    return () => cleanup();
  }, [stream]);

  useEffect(() => {
    filterRef.current = getFilterUniforms(filter);
  }, [filter]);

  return (
    <canvas
      ref={canvasRef}
      style={style}
      className={`${className ?? ""} w-full h-full object-cover`}
    />
  );
});

export function BlankCanvas({
  ref,
  overlay,
  resolution,
}: {
  ref: React.RefObject<HTMLCanvasElement | null>;
  overlay?: string;
  resolution?: { widthPixel: number; heightPixel: number };
}) {
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

  return (
    <canvas
      ref={ref}
      className="w-full h-full"
      width={resolution?.widthPixel ?? 1280}
      height={resolution?.heightPixel ?? 720}
    />
  );
}

function getFilterUniforms(filter: Filter) {
  switch (filter) {
    case "bright":
      return {
        ...neutral,
        brightness: 1.2,
        contrast: 1.0,
        saturation: 1.0,
      };
    case "monotone": {
      return {
        ...neutral,
        brightness: 1.1,
        contrast: 0.9,
        saturation: 0.0,
      };
    }
    case "natural":
      return {
        ...neutral,
        brightness: 1.05,
        contrast: 1.05,
        saturation: 1.0,
      };
    case "soft":
      return {
        ...neutral,
        brightness: 1.1,
        contrast: 0.85,
        saturation: 1.1,
      };
    case "lark":
      return {
        ...neutral,
        brightness: 1.15,
        contrast: 0.95,
        saturation: 0.8,
      };
    case "grayscale":
      return {
        ...neutral,
        brightness: 1.0,
        contrast: 1.0,
        saturation: 0.0,
      };
    case "warm":
      return {
        ...neutral,
        brightness: 1.1,
        contrast: 1.0,
        saturation: 1.2,
      };
    case "cold":
      return {
        ...neutral,
        brightness: 0.9,
        contrast: 1.0,
        saturation: 0.8,
      };
    case "dark":
      return {
        ...neutral,
        brightness: 0.8,
        contrast: 1.0,
        saturation: 1.0,
      };
    case "timecapsule":
      return {
        ...neutral,
        brightness: 1.15,
        exposure: 0.22,
        saturation: 0.74,
        contrast: 0.95,
        tint: 1.04,
        colorTemp: 1.04,
        bloomThreshold: 0.3,
        bloomIntensity: 0.1,
        highlights: 0.1,
        clarity: -0.15,
        mist: 0.3,
        mistScale: 100,
        mistSpeed: 0.1,
        vibrance: 0.95,
        shadows: 0.1,
        vignetteRadius: 0.7,
        vignetteSoftness: 0.3,
      };
    default:
      return {
        ...neutral,
        brightness: 1.0,
        contrast: 1.0,
        saturation: 1.0,
      };
  }
}

const neutral: FilterData = {
  brightness: 1.0,
  contrast: 1.0,
  saturation: 1.0,
  exposure: 0.0,
  colorTemp: 1.0,
  tint: 1.0,
  highlights: 0.0,
  shadows: 0.0,
  vibrance: 0.0,
  clarity: 0.0,
  blur: 0.0,
  mist: 0.0,
  mistScale: 0.0,
  mistSpeed: 0.0,
  bloomThreshold: 0.0,
  bloomIntensity: 0.0,
  vignetteRadius: 1.0,
  vignetteSoftness: 0.0,
};
