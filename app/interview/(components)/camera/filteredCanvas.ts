import { WebGLRenderer } from "./webglRenderer";

interface FilterOptions {
  width?: number;
  height?: number;
  fps?: number;
}

export interface FilteredCanvasElement extends HTMLCanvasElement {
  updateFilter: (filter: Filter) => void;
  cleanup: () => void;
}

const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 720;
const DEFAULT_FPS = 24;

export function createFilteredCanvas(
  stream: MediaStream,
  filter: Filter = "default",
  options: FilterOptions = {}
): FilteredCanvasElement {
  // 비디오 요소 생성 및 설정
  const video = document.createElement("video");
  video.srcObject = stream;
  video.autoplay = true;
  video.playsInline = true;
  video.muted = true;
  video.style.width = "0px";
  video.style.height = "0px";
  video.style.visibility = "hidden";
  document.body.appendChild(video);

  // 캔버스 생성 및 설정
  const canvas = document.createElement("canvas") as FilteredCanvasElement;
  canvas.width = options.width || DEFAULT_WIDTH;
  canvas.height = options.height || DEFAULT_HEIGHT;
  canvas.style.width = "0px";
  canvas.style.height = "0px";
  canvas.style.visibility = "hidden";
  document.body.appendChild(canvas);

  // WebGL 컨텍스트 초기화
  const gl = canvas.getContext("webgl");
  if (!gl) throw new Error("WebGL not supported in this browser");

  const webglRenderer = new WebGLRenderer(gl);
  webglRenderer.init();

  // 필터 초기화
  let filterUniforms = getFilterUniforms(filter);

  // FPS 설정
  const fps = options.fps || DEFAULT_FPS;
  const frameInterval = 1000 / fps;

  // 프레임 ID 저장
  let frameId: number | null = null;

  // 프레임 렌더링 함수
  const drawFrame = () => {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      // 비디오 크기에 맞춰 캔버스 크기 조정
      if (
        video.videoWidth !== canvas.width ||
        video.videoHeight !== canvas.height
      ) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      webglRenderer.draw(video, filterUniforms);
      frameId = window.setTimeout(drawFrame, frameInterval);
    }
  };

  // 비디오 메타데이터 로드 시 렌더링 시작
  video.onloadedmetadata = () => {
    // 초기 캔버스 크기 설정
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    drawFrame();
  };

  // 에러 처리
  video.onerror = (error) => {
    console.error("Video error:", error);
    cleanup();
  };

  // 스트림 종료 시 정리
  stream.getTracks().forEach((track) => {
    track.onended = () => cleanup();
  });

  // 리소스 정리 함수
  function cleanup(): void {
    if (frameId) {
      window.clearTimeout(frameId);
      frameId = null;
    }
    webglRenderer.cleanup();
    video.srcObject = null;
  }

  // 필터 업데이트 함수를 캔버스에 추가
  canvas.updateFilter = (newFilter: Filter): void => {
    filterUniforms = getFilterUniforms(newFilter);
  };

  // cleanup 함수를 캔버스에 추가
  canvas.cleanup = cleanup;

  return canvas;
}

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

export function createBlankCanvas(
  width?: number,
  height?: number
): FilteredCanvasElement {
  const canvas = document.createElement("canvas") as FilteredCanvasElement;
  canvas.updateFilter = () => {};
  canvas.cleanup = () => {};
  canvas.width = width || DEFAULT_WIDTH;
  canvas.height = height || DEFAULT_HEIGHT;

  return canvas;
}
