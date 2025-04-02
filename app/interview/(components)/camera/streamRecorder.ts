// stream을 녹화하는 클래스
export class StreamRecorder {
  private recorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private recording: boolean = false;
  private chunksReadyPromise: Promise<void> | null = null;
  private resolveChunksReady: (() => void) | null = null;
  private mimetype: string = "video/webm";

  get isRecording(): boolean {
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

  startRecording(stream: MediaStream) {
    // 오디오 트랙 추가
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((audioStream) => {
        const audioTrack = audioStream.getAudioTracks()[0];
        stream.addTrack(audioTrack);

        if (MediaRecorder.isTypeSupported("video/webm;codecs=h264,opus")) {
          this.mimetype = "video/webm;codecs=h264,opus";
        } else if (
          MediaRecorder.isTypeSupported("video/mp4;codecs=avc1,mp4a")
        ) {
          this.mimetype = "video/mp4;codecs=avc1,mp4a";
        } else {
          this.mimetype = "video/webm";
        }

        console.log("RecorderType", this.mimetype);
        this.recorder = new MediaRecorder(stream, {
          mimeType: this.mimetype,
        });

        this.chunksReadyPromise = new Promise((resolve) => {
          this.resolveChunksReady = resolve;
        });

        this.recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            this.chunks.push(event.data);
          }
        };

        this.recorder.onstop = () => {
          this.recording = false;
          if (this.resolveChunksReady) {
            this.resolveChunksReady();
            this.chunksReadyPromise = null;
          }
        };

        this.recorder.start();
        this.recording = true;
      })
      .catch((error) => {
        throw new Error("녹화 시작에 실패했습니다. 마이크와 카메라 권한을 확인해주세요.");
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
    console.log("BlobType", this.mimetype);
    const blob = new Blob(this.chunks, { type: this.mimetype });
    return URL.createObjectURL(blob);
  }
}
