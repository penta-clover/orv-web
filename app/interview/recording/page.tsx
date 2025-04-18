"use client";

import "@/app/components/blackBody.css";
import Image from "next/image";
import { SubtitleCanvas } from "../(components)/camera/subtitleCanvas";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ExitInterviewModal from "../(components)/exitInterviewModal";
import { useStoryboardRepository } from "@/providers/StoryboardRepositoryContext";
import TipBox from "../(components)/tipBox";
import NextButton from "../(components)/nextButton";
import { StreamRecorder } from "../(components)/camera/streamRecorder";
import { getCameraStream } from "../(components)/camera/cameraStream";
import BackgroundMusic from "./backgroundMusic";
import {
  BlankCanvas,
  FilteredCanvas,
} from "../(components)/camera/filteredCanvas";
import Scene from "../../components/scene/scene";
import SceneFactory from "../../components/scene/sceneFactory";
import { isSubtitled } from "../../components/scene/renderingOptions/subtitled";
import { isPreviewOverlay } from "../../components/scene/renderingOptions/previewOverlay";
import { isKnowNextScene } from "../../components/scene/renderingOptions/knowNextScene";
import { isEnding } from "../../components/scene/renderingOptions/ending";
import InterviewContext from "../../components/scene/interviewContext";
import { getPermissionGuideText } from "../(components)/getPermissionGuideText";
import usePermissionReload from "../(components)/usePermissionReload";
import { error } from "console";
import { useTemplateService } from "@/providers/TemplateServiceContext";
import { useTempBlobRepository } from "@/providers/TempBlobRepositoryContext";

interface QuestionContent {
  number: number;
  question: string;
  hint: string;
  nextSceneId?: string;
}

export default function Page() {
  return (
    <>
      <BackgroundMusic />
      <Suspense>
        <Body />
      </Suspense>
    </>
  );
}

function Body() {
  const searchParams = useSearchParams();
  const storyboardId = searchParams.get("storyboardId")!;
  const aspect = searchParams.get("aspect")! as Aspect;
  const filter = searchParams.get("filter")! as Filter;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showTip, setShowTip] = useState<boolean>(true);
  const [currentScene, setCurrentScene] = useState<Scene | undefined>();
  const [originalVideoStream, setOriginalVideoStream] =
    useState<MediaStream | null>(null);
  const [originalAudioStream, setOriginalAudioStream] =
    useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLowMicVolume, setIsLowMicVolume] = useState(false);

  const streamRecorderRef = useRef<StreamRecorder | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null); // 녹화 중 사용자에게 표시되는 캔버스
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // 녹화되는 캔버스
  const startTimeRef = useRef<number>(0);
  const interviewContext = useRef<InterviewContext>(new InterviewContext());
  const router = useRouter();

  const storyboardRepository = useStoryboardRepository();
  const templateService = useTemplateService();
  const tempBlobRepository = useTempBlobRepository();
  const RECORDING_FPS = 24; // 녹화 프레임 레이트 설정

  // 카메라/마이크 권한 허용되면 새로고침
  usePermissionReload("microphone");
  usePermissionReload("camera");

  const waitForCanvasReady = (cb: () => void) => {
    const interval = setInterval(() => {
      const canvas = canvasRef.current;
      if (canvas && canvas.width !== 300 && canvas.height !== 150) {
        console.log(`Canvas is ready (${canvas.width}x${canvas.height})`);
        clearInterval(interval);
        cb();
      } else {
        console.log(
          `Waiting for canvas to be ready... (${canvas?.width}x${canvas?.height})`
        );
      }
    }, 50); // 50ms 간격으로 체크
  };

  useEffect(() => {
    streamRecorderRef.current = new StreamRecorder();

    // TODO: Promise.all로 최적화
    getCameraStream({ useAudio: false })
      .then(async (originalStream) => {
        const storyboard = await storyboardRepository.getStoryboardInfo(
          storyboardId
        );
        const scene = await storyboardRepository.getSceneInfo(
          storyboard.startSceneId
        );
        const templateData = await templateService.getTemplateData();
        interviewContext.current.templateData = templateData;

        loadScene(scene.id, 1);

        // 첫 질문이 로드될 때 인터뷰 시작 시간 기록
        startTimeRef.current = Date.now();
        if (!canvasRef.current) return;

        // 캡쳐된 비디오와 원본 오디오를 조합해 녹화용 스트림 생성
        const [videoTrack] = canvasRef
          .current!.captureStream(RECORDING_FPS)
          .getVideoTracks();

        const audioStream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
        });

        setOriginalAudioStream(audioStream);
        const [audioTrack] = audioStream.getAudioTracks();
        const captureStream = new MediaStream([videoTrack, audioTrack]);
        try {
          console.log(
            `current canvas resolution: ${canvasRef.current.width}x${canvasRef.current.height}`
          );

          // 캔버스가 준비될 때까지 대기
          waitForCanvasReady(() => {
            streamRecorderRef.current?.startRecording(captureStream); // 녹화 시작
          });
        } catch (error) {
          alert(getPermissionGuideText());
        }

        setOriginalVideoStream(originalStream);
      })
      .catch((error) => {
        alert(getPermissionGuideText());
      });
  }, []);

  const previewStream = useMemo(() => {
    if (!originalVideoStream) {
      return null;
    }

    // 비디오만 복사
    const [videoTrack] = originalVideoStream.getVideoTracks();
    return new MediaStream([videoTrack]); // ← 오디오 없음
  }, [originalVideoStream]);

  // stream이 설정된 후, 오디오 볼륨 모니터링
  useEffect(() => {
    if (!originalAudioStream) return;
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(originalAudioStream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let lowVolumeStart: number | null = null;

    const volumeMonitor = setInterval(() => {
      analyser.getByteTimeDomainData(dataArray);
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += Math.abs(dataArray[i] - 128);
      }
      const avg = sum / bufferLength;
      const THRESHOLD = 2.2; // 임계값 (필요에 따라 조정)

      console.log("avg: " + avg);
      if (avg < THRESHOLD) {
        if (lowVolumeStart === null) {
          lowVolumeStart = Date.now();
        } else if (Date.now() - lowVolumeStart >= 10000) {
          // 경고 메시지가 중복으로 뜨지 않도록 lowVolumeStart를 갱신
          lowVolumeStart = Date.now();
          setIsLowMicVolume(true);
        }
      } else {
        lowVolumeStart = null;
        setIsLowMicVolume(false);
      }
    }, 500);

    // 컴포넌트 언마운트 시 클리어
    return () => {
      clearInterval(volumeMonitor);
      audioContext.close();
    };
  }, [originalAudioStream]);

  // 질문 불러오기
  const loadScene = (sceneId: string, number: number) => {
    storyboardRepository.getSceneInfo(sceneId).then((scene) => {
      const newScene: Scene = SceneFactory.createScene(
        scene,
        interviewContext.current
      );

      setCurrentScene(newScene);

      // Strict Mode에서만 렌더링이 두 번 발생 > addScene이 두 번 호출됨
      // Production 환경에서는 문제가 없습니다.
      interviewContext.current.addScene(newScene);

      if (isEnding(newScene)) {
        streamRecorderRef.current
          ?.stopRecording()
          .then(() => downloadRecording());
      }

      setIsLoading(false);
    });
  };

  // 녹화된 파일 다운로드 함수
  // 녹화 정지 직후 호출시 recordedChunks가 비어있을 수 있음 (65번째줄 참고)
  const downloadRecording = async () => {
    console.log("downloadRecording");
    try {
      const blob = streamRecorderRef.current?.getBlob();
      if (!blob) {
        console.error("Blob 데이터를 가져오지 못했습니다.");
        // TODO: 사용자에게 오류 알림
        return;
      }

      const blobKey = await tempBlobRepository.saveBlob(blob);
      // 인터뷰 전체 시간 계산 (초 단위)
      const totalInterviewTime = Math.floor(
        (Date.now() - startTimeRef.current) / 1000
      );

      // videoUrl 대신 blobKey 전달
      router.replace(
        `/interview/finish/credit?blobKey=${blobKey}&storyboardId=${storyboardId}&totalInterviewTime=${totalInterviewTime}`
      );

      streamRecorderRef.current?.reset();
    } catch (error) {
      console.error("IndexedDB 저장 또는 페이지 이동 중 오류:", error);
      // TODO: 사용자에게 오류 알림
    }
  };

  return (
    <ExitInterviewModal
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      onExitInterview={() => router.replace("/")}
    >
      <div className="relative w-full h-[calc(100dvh)] flex flex-col items-center justify-start py-[20px] px-[48px] overflow-hidden">
        <div className="flex flex-col grow items-center justify-center">
          <div className="w-[90dvw] md:w-[700px] max-w-[calc(80dvh*16/9)] lg:w-[800px] xl:w-[80dvw] flex justify-end mb-[10px]">
            <div
              className="w-full flex items-center justify-self-start active:scale-95"
              onClick={() => setIsModalOpen(true)}
            >
              {isLowMicVolume && (
                <div className="h-[44px] bg-grayscale-800 rounded-[12px] flex items-center self-end gap-[4px] p-[12px]">
                  <Image
                    unoptimized
                    src="/icons/mic-off-grayscale-white.svg"
                    width={24}
                    height={24}
                    alt="close"
                    className="focus:outline-none cursor-pointer"
                  />
                  <span className="text-head3 text-grayscale-50">
                    목소리가 너무 작아요. 더 크게 말해주세요.
                  </span>
                </div>
              )}
            </div>
            <div
              className="w-[139px] h-[56px] flex items-center justify-center gap-[2px] bg-grayscale-50 rounded-[12px] self-end active:scale-95"
              onClick={() => setIsModalOpen(true)}
            >
              <Image
                unoptimized
                src="/icons/x-grayscale-black.svg"
                width={24}
                height={24}
                alt="close"
                className="focus:outline-none cursor-pointer"
              />
              <span className="text-head3 text-grayscale-800">종료하기</span>
            </div>
          </div>

          <div className="relative flex justify-center items-center w-[90dvw] max-h-[85dvh] max-w-[calc(80dvh*16/9)] aspect-16/9 md:w-[700px] lg:w-[800px] xl:w-[80dvw] bg-grayscale-900 rounded-[12px] overflow-hidden">
            {aspect === "none" ? (
              <BlankCanvas
                ref={previewCanvasRef}
                overlay="/images/studio-lighting-fhd.png"
              />
            ) : (
              <FilteredCanvas
                stream={previewStream ?? undefined}
                filter={filter}
                ref={previewCanvasRef}
                overlay="/images/studio-lighting-fhd.png"
              />
            )}
            <SubtitleCanvas
              ref={canvasRef}
              sourceCanvasRef={previewCanvasRef}
              subtitles={
                isSubtitled(currentScene) ? currentScene.getSubtitles() : []
              }
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%", // ← 최소 1 px 이상
                height: "100%", // ← 최소 1 px 이상
                opacity: 0.01, // 화면엔 안 보임
                pointerEvents: "none",
              }}
              fps={RECORDING_FPS}
            />

            {isPreviewOverlay(currentScene) && currentScene.getOverlays()}

            <div className="absolute bottom-[24.5px] right-[24.5px] flex flex-col items-end gap-[10px]">
              {showTip && (
                <TipBox
                  tag="Tip!"
                  text="마우스 클릭 혹은 방향키 좌우동작을\n통해 조작하세요!"
                  tagColor="text-main-lilac50"
                  dismissOnClick
                />
              )}
              <NextButton
                onClick={() => {
                  if (isLoading) {
                    return;
                  }
                  setIsLoading(true);

                  if (isKnowNextScene(currentScene)) {
                    const nextSceneId = currentScene.getNextSceneId();
                    loadScene(nextSceneId, 1);
                  }

                  setShowTip(false);
                }}
                useKeyboardShortcut
                className="rounded-[28px] w-[48px] h-[48px] p-0 flex items-center justify-center"
              >
                <Image
                  unoptimized
                  src="/icons/right-arrow-black.svg"
                  alt="right-arrow"
                  width={24}
                  height={24}
                />
              </NextButton>
            </div>

            {isEnding(currentScene) && (
              <div className="w-full h-full">
                <Image
                  src="/icons/rolling-spinner-grayscale-white.gif"
                  alt="spinner"
                  width={48}
                  height={48}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 "
                  style={{ color: "white" }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </ExitInterviewModal>
  );
}
