interface CameraStreamOptions {
  idealWidth?: number;
  idealHeight?: number;
  useAudio?: boolean;
}

const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 720;

export async function getCameraStream(
  options: CameraStreamOptions = {}
): Promise<MediaStream> {
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

  return stream;
}
