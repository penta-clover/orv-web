export class CanvasRecorder {
  private recorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private recording: boolean = false;
  private chunksReadyPromise: Promise<void> | null = null;
  private resolveChunksReady: (() => void) | null = null;

  get isRecording() {
    return this.recording;
  }

  get readyToDownload() {
    return this.chunks.length > 0 && this.chunksReadyPromise === null;
  }

  reset() {
    this.chunks = [];
    this.chunksReadyPromise = null;
    this.resolveChunksReady = null;
  }

  startRecording(canvas: HTMLCanvasElement, fps: number) {
    const stream = canvas.captureStream(fps);

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((audioStream) => {
        const audioTrack = audioStream.getAudioTracks()[0];
        stream.addTrack(audioTrack);

        const recorder = new MediaRecorder(stream, {
          mimeType: "video/mp4; codecs=vp9,opus",
        });
        this.recorder = recorder;
        this.chunksReadyPromise = new Promise((resolve) => {
          this.resolveChunksReady = resolve;
        });

        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            this.chunks.push(event.data);
          }
        };

        recorder.onstop = () => {
          this.recording = false;
          if (this.resolveChunksReady) {
            this.resolveChunksReady();
            this.chunksReadyPromise = null;
          }
        };

        recorder.start();
        this.recording = true;
      })
      .catch((error) => {
        console.error("오디오 스트림 가져오기 실패:", error);
      });
  }

  async stopRecording(): Promise<void> {
    if (this.recorder) {
      this.recorder.stop();
      if (this.chunksReadyPromise) {
        await this.chunksReadyPromise;
      }
    }
  }

  getBlobUrl() {
    if (this.chunksReadyPromise) {
      throw new Error("녹화 데이터가 아직 준비되지 않았습니다.");
    }
    const blob = new Blob(this.chunks, { type: "video/mp4" });
    return URL.createObjectURL(blob);
  }
}
