interface CameraStreamOptions {
  idealWidth?: number;
  idealHeight?: number;
  useAudio?: boolean;
}

interface CameraStreamResult {
  stream: MediaStream;
  cleanup: () => void;
}

interface CameraStreamVideoOptions extends CameraStreamOptions {
  video?: HTMLVideoElement; // 비디오 요소를 직접 제공할 수 있음 (비디오를 숨기지 않고 싶을 때 등)
}

interface CameraStreamVideoResult {
  video: HTMLVideoElement;
  cleanup: () => void;
}

const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 720;

export async function getCameraStream(
  options: CameraStreamOptions = {}
): Promise<CameraStreamResult> {
  if (typeof window === "undefined") {
    throw new Error("getCameraStream is not supported on the server");
  }
  if (!navigator.mediaDevices) {
    throw new Error("getUserMedia is not supported");
  }

  const {
    idealWidth = DEFAULT_WIDTH,
    idealHeight = DEFAULT_HEIGHT,
    useAudio = true,
  } = options;

  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      // HD 해상도 적용
      width: { ideal: idealWidth },
      height: { ideal: idealHeight },
    },
    audio: useAudio,
  });

  return {
    stream,
    cleanup: () => {
      stream.getTracks().forEach((track) => track.stop());
    },
  };
}

// 사실 비동기로 안하고 바로 비디오 반환해도 되는데, 그러면 스켈레톤 처리가 더 복잡해지겠죠?
export async function getCameraStreamVideo(
  options: CameraStreamVideoOptions = {}
): Promise<CameraStreamVideoResult> {
  const { stream, cleanup } = await getCameraStream(options);
  const video = options.video || document.createElement("video");
  video.srcObject = stream;

  if (!options.video) {
    video.autoplay = true;
    video.playsInline = true;
    video.muted = true;
    video.style.width = "16px";
    video.style.height = "9px";
    video.style.position = "absolute";
    video.style.top = "0";
    video.style.left = "0";
    video.style.opacity = "0";
    video.style.pointerEvents = "none"; // 비디오 요소가 클릭 이벤트를 받지 않도록 설정
    document.body.appendChild(video);
  }

  // 비디오 요소가 로드될 때까지 대기
  await new Promise<void>((resolve) => {
    const listener = () => {
      video.removeEventListener("canplaythrough", listener);
      video.play().then(() => resolve());
    };
    video.addEventListener("canplaythrough", listener);
  });

  video.height = video.videoHeight;
  video.width = video.videoWidth;

  return {
    video,
    cleanup: () => {
      cleanup();
      video.srcObject = null;
      console.log("Clean Up Camera Stream & Video");
    },
  };
}
