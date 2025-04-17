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
    const audioContext = new AudioContext();
    const sourceNode = audioContext.createMediaStreamSource(stream);

    // 다이내믹 레인지 압축 노드: 목소리의 작은 소리를 키워주고 큰 소리는 줄여줌
    const compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.value = -50; // 압축 시작 임계값 (상황에 따라 조절)
    compressor.knee.value = 40; // 부드러운 압축 적용 정도
    compressor.ratio.value = 12; // 압축 비율
    compressor.attack.value = 0; // 압축 시작 속도
    compressor.release.value = 0.25; // 압축 해제 속도

    // BiquadFilterNode: 특정 주파수 대역(예, 중음역)을 강조하여 음성을 더 선명하게 함
    const biquadFilter = audioContext.createBiquadFilter();
    biquadFilter.type = "peaking";
    biquadFilter.frequency.value = 1000; // 대략 목소리의 중심 주파수 (상황에 따라 조절)
    biquadFilter.gain.value = 3; // 강조 정도 (dB 단위)

    // 노드 연결: source -> compressor -> filter -> destination
    sourceNode.connect(compressor);
    compressor.connect(biquadFilter);
    const destination = audioContext.createMediaStreamDestination();
    biquadFilter.connect(destination);

    // 후처리된 오디오 트랙을 기존의 녹화 스트림에 추가
    const processedAudioTrack = destination.stream.getAudioTracks()[0];

    const videoTrack = stream.getVideoTracks()[0]; // 캔버스 비디오
    const recordingStream: MediaStream = new MediaStream([videoTrack, processedAudioTrack]);

    if (MediaRecorder.isTypeSupported("video/webm;codecs=h264,opus")) {
      this.mimetype = "video/webm;codecs=h264,opus";
    } else if (MediaRecorder.isTypeSupported("video/mp4;codecs=avc1,mp4a")) {
      this.mimetype = "video/mp4;codecs=avc1,mp4a";
    } else {
      this.mimetype = "video/webm";
    }

    console.log("RecorderType", this.mimetype);
    this.recorder = new MediaRecorder(recordingStream, {
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

  // Blob 객체를 직접 반환하는 메서드 추가
  getBlob(): Blob {
    if (this.chunksReadyPromise) {
      throw new Error("녹화 데이터가 아직 준비되지 않았습니다.");
    }
    if (this.chunks.length === 0) {
      throw new Error("녹화된 데이터가 없습니다.");
    }
    console.log("BlobType", this.mimetype);
    return new Blob(this.chunks, { type: this.mimetype });
  }
}
