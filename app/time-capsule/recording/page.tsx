"use client";

import { isPreviewOverlay } from "@/app/components/scene/renderingOptions/previewOverlay";
import { isSubtitled } from "@/app/components/scene/renderingOptions/subtitled";
import Scene from "@/app/components/scene/scene";
import { getCameraStream } from "@/app/interview/(components)/camera/cameraStream";
import {
  BlankCanvas,
  FilteredCanvas,
} from "@/app/interview/(components)/camera/filteredCanvas";
import { StreamRecorder } from "@/app/interview/(components)/camera/streamRecorder";
import { SubtitleCanvas } from "@/app/interview/(components)/camera/subtitleCanvas";
import { getPermissionGuideText } from "@/app/interview/(components)/getPermissionGuideText";
import usePermissionReload from "@/app/interview/(components)/usePermissionReload";
import { useTempBlobRepository } from "@/providers/TempBlobRepositoryContext";
import { count } from "console";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import "@/app/components/blackBody.css";

export default function Page() {
  return (
    <Suspense>
      <Body />
    </Suspense>
  );
}

function Body() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic");
  const question = searchParams.get("question");

  const aspect = searchParams.get("aspect")! as Aspect;
  const filter = searchParams.get("filter")! as Filter;

  const RECORDING_FPS = 24; // 녹화 프레임 레이트 설정
  const LIMIT_SECONDS = 6000; // 녹화 제한 시간 (초 단위)

  const router = useRouter();

  const [currentScene, setCurrentScene] = useState<Scene | undefined>();
  const [originalVideoStream, setOriginalVideoStream] =
    useState<MediaStream | null>(null);
  const streamRecorderRef = useRef<StreamRecorder | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null); // 녹화 중 사용자에게 표시되는 캔버스
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // 녹화되는 캔버스
  const [resolution, setResolution] = useState<{
    widthPixel: number;
    heightPixel: number;
  } | null>(null);
  const [leftSeconds, setLeftSeconds] = useState(LIMIT_SECONDS);
  const [startCountdown, setStartCountdown] = useState<number>(3);
  const isCountdownEnd = useRef<boolean>(false);
  const tempBlobRepository = useTempBlobRepository();
  const [isInstagramBrowser, setIsInstagramBrowser] = useState<boolean | null>(
    null
  );
  const [canLoadMedia, setCanLoadMedia] = useState<boolean | null>(null);

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

  const waitForStartCountdown = (cb: () => void) => {
    const interval = setInterval(() => {
      if (isCountdownEnd.current) {
        console.log("Start countdown finished");
        clearInterval(interval);
        cb();
      } else {
        console.log(
          `Waiting for start countdown... (${isCountdownEnd.current})`
        );
      }
    }, 50); // 50ms 간격으로 체크
  };

  const countdown = () => {
    const countdownInterval = setInterval(() => {
      setLeftSeconds((prev) => {
        if (prev === 0) {
          clearInterval(countdownInterval);
          streamRecorderRef.current
            ?.stopRecording()
            .then(() => downloadRecording());
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return countdownInterval;
  };

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

      // videoUrl 대신 blobKey 전달
      router.replace(`/time-capsule/finish?blobKey=${blobKey}&topic=${topic}`);

      streamRecorderRef.current?.reset();
    } catch (error) {
      console.error("IndexedDB 저장 또는 페이지 이동 중 오류:", error);
    }
  };

  const previewStream = useMemo(() => {
    if (!originalVideoStream) {
      return null;
    }

    // 비디오만 복사
    const [videoTrack] = originalVideoStream.getVideoTracks();
    return new MediaStream([videoTrack]); // ← 오디오 없음
  }, [originalVideoStream]);

  useEffect(() => {
    // Instagram 브라우저 감지
    const userAgent = navigator.userAgent || navigator.vendor;
    const isInstagram =
      userAgent.includes("Instagram") ||
      (userAgent.includes("FBAN") && userAgent.includes("FBAV"));
    setIsInstagramBrowser(isInstagram);
  }, []);

  useEffect(() => {
    streamRecorderRef.current = new StreamRecorder();

    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then(async (originalCameraStream) => {
        setCanLoadMedia(true);

        // 해상도 선택
        const track = originalCameraStream.getVideoTracks()[0];

        await track.applyConstraints({
          aspectRatio: 3 / 4,
          resizeMode: "none",
        } as any);

        setResolution({
          widthPixel: 1080,
          heightPixel: 1440,
        });

        const videoTrack = canvasRef
          .current!.captureStream(RECORDING_FPS)
          .getVideoTracks()[0];
        const audioTrack = (
          await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
          })
        ).getAudioTracks()[0];

        const captureStream = new MediaStream([videoTrack, audioTrack]);

        try {
          // 캔버스가 준비될 때까지 대기
          waitForCanvasReady(() => {
            waitForStartCountdown(() => {
              countdown();
              streamRecorderRef.current?.startRecording(captureStream); // 녹화 시작
            });
          });
        } catch (error) {
          alert(getPermissionGuideText());
        }

        setOriginalVideoStream(originalCameraStream);
      })
      .catch((error) => {
        setCanLoadMedia(false);
      });
  }, []);

  useEffect(() => {
    const countdown = setInterval(() => {
      setStartCountdown((prev) => {
        if (prev === 1) {
          isCountdownEnd.current = true;
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(countdown);
    };
  }, []);

  useEffect(() => {
    // 인스타그램 브라우저가 아니지만 미디어를 로드할 수 없는 경우
    if (isInstagramBrowser === true && canLoadMedia === false) {
      window.location.reload();
    }
  }, [isInstagramBrowser, canLoadMedia]);

  return (
    <div className="relative flex flex-col bg-dark h-[calc(100dvh)] overflow-hidden w-full justify-center">
      {isInstagramBrowser && canLoadMedia !== true && (
        <div className="absolute relative flex items-end flex-col top-0 left-0 right-0 px-[20px] pt-[10px] animate-updown z-50">
          <Image
            unoptimized
            src="/icons/tooltip-triangle.svg"
            alt="tooltip-triangle"
            width={12}
            height={20}
            className="rotate-180 mr-[4px] -mb-[4px]"
          />
          <div className="px-[15px] py-[11px] text-body3 text-grayscale-50 whitespace-pre-wrap bg-grayscale-700 rounded-[10px]">
            녹화가 진행되지 않으면 상단 메뉴에서 "외부 브라우저에서 열기"를
            선택해주세요
          </div>
        </div>
      )}

      <div className="grow" />

      {canLoadMedia !== false && (
        <div className="text-grayscale-50 text-head2 mx-[16px]">
          Q. {question}
        </div>
      )}
      <div className="h-[16px] shrink" />

      <div className="relative flex justify-center items-center w-full aspect-[3/4] bg-grayscale-900 overflow-hidden hide-scrollbar">
        {aspect === "none" ? (
          <BlankCanvas
            ref={previewCanvasRef}
            overlay="/images/studio-lighting-no-logo.png"
            resolution={resolution ?? undefined}
          />
        ) : (
          <FilteredCanvas
            stream={previewStream ?? undefined}
            filter={filter}
            ref={previewCanvasRef}
            overlay="/images/studio-lighting-no-logo.png"
            resolution={resolution ?? undefined}
          />
        )}
        <SubtitleCanvas
          ref={canvasRef}
          sourceCanvasRef={previewCanvasRef}
          subtitles={
            isSubtitled(currentScene) ? currentScene.getSubtitles() : []
          }
          style={{
            width: "0",
            height: "0",
            position: "absolute",
            opacity: "0",
            pointerEvents: "none",
          }}
          fps={RECORDING_FPS}
        />
        {!isCountdownEnd.current && (
          <div className="absolute flex justify-center items-center w-full h-full bg-grayscale-900 opacity-[80] z-45">
            <div className="text-grayscale-50 text-head1 text-[50px]">
              {startCountdown}
            </div>
          </div>
        )}
        {isInstagramBrowser && canLoadMedia === false && (
          <div className="absolute flex flex-col justify-center items-center w-full h-full bg-grayscale-900 opacity-[80] z-50">
            <div className="text-head2 text-grayscale-50">
              외부 브라우저에서 계속할 수 있어요
            </div>
            <div className="h-[8px]" />
            <div className="flex justify-center items-center text-body4 text-grayscale-50 whitespace-pre-wrap text-center">
              우측 상단 메뉴(···)에서
              <br />
              "외부 브라우저에서 열기"를 선택해주세요
            </div>
          </div>
        )}
      </div>

      <div className="h-[16px] shrink" />

      {canLoadMedia !== false && (
        <div className="flex justify-end mx-[16px]">
          <div className="text-grayscale-50 text-head3">
            {/* 01:00 형태로 현재 녹화 시간 표시 */}
            {`${Math.floor((LIMIT_SECONDS - leftSeconds) / 60)
              .toString()
              .padStart(2, "0")}:${((LIMIT_SECONDS - leftSeconds) % 60)
              .toString()
              .padStart(2, "0")}`}
          </div>
        </div>
      )}

      <div className="grow" />

      {canLoadMedia !== false && (
        <div className="text-center w-full text-grayscale-300 text-caption1">
          시간이 다 되면 자동으로 기록이 마무리됩니다
        </div>
      )}

      <div className="h-[18px]" />
    </div>
  );
}
