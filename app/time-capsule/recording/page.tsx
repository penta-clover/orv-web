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
  const LIMIT_SECONDS = 60; // 녹화 제한 시간 (초 단위)

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
  const [startCountdown, setStartCountdown] = useState<number>(5);
  const isCountdownEnd = useRef<boolean>(false);
  const tempBlobRepository = useTempBlobRepository();
  const [isInstagramBrowser, setIsInstagramBrowser] = useState<boolean | null>(
    null
  );
  const [canLoadMedia, setCanLoadMedia] = useState<boolean | null>(null);
  const [isScriptOpened, setIsScriptOpened] = useState<boolean>(false);

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
          endInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return countdownInterval;
  };

  const endInterview = () => {
    streamRecorderRef.current?.stopRecording().then(() => downloadRecording());
  };

  const downloadRecording = async () => {
    console.log("downloadRecording");
    try {
      const blob = streamRecorderRef.current?.getBlob();
      if (!blob) {
        console.error("Blob 데이터를 가져오지 못했습니다.");
        alert("녹화 영상을 저장하는 중 오류가 발생했습니다.");
        return;
      }

      const blobKey = await tempBlobRepository.saveBlob(blob);

      // videoUrl 대신 blobKey 전달
      router.replace(
        `/time-capsule/gift/first?blobKey=${blobKey}&topic=${topic}`
      );
      streamRecorderRef.current?.reset();
    } catch (error) {
      console.error("IndexedDB 저장 또는 페이지 이동 중 오류:", error);
      alert("녹화 영상을 저장하는 중 오류가 발생했습니다.");
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

        const track = originalCameraStream.getVideoTracks()[0];
        await track.applyConstraints({
          aspectRatio: 1 / 1,
          resizeMode: "none",
        } as any);

        setResolution({
          widthPixel: 1440,
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
        console.error("getUserMedia error:", error);
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

  return (
    <div className="relative flex flex-col bg-dark h-[calc(100dvh)] overflow-scroll w-full hide-scrollbar">
      {canLoadMedia !== false && (
        <div className="flex justify-between items-center mx-[10px] shrink-0 h-[22px]">
          <div className="flex items-center gap-[4px]">
            <div className="flex flex-col justify-center items-center w-[12px] h-[12px] m-[2px] rounded-full bg-[#FF0000] text-caption1 text-grayscale-black shrink-0" />
            <div className="text-grayscale-50 text-body4">
              {/* 01:00 형태로 현재 녹화 시간 표시 */}
              {`${Math.floor((LIMIT_SECONDS - leftSeconds) / 60)
                .toString()
                .padStart(2, "0")}:${((LIMIT_SECONDS - leftSeconds) % 60)
                .toString()
                .padStart(2, "0")}`}
            </div>
          </div>

          <div className="text-grayscale-300 text-caption1">
            시간이 다 되면 자동으로 기록이 마무리됩니다
          </div>
        </div>
      )}

      {isInstagramBrowser && canLoadMedia === false && (
        <div className="absolute flex items-end flex-col top-0 left-0 right-0 px-[20px] pt-[10px] animate-updown z-50 shrink-0">
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

      <div className="relative flex justify-center items-center w-full aspect-[1/1] bg-grayscale-900 overflow-hidden hide-scrollbar z-30 shrink-0">
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
        {canLoadMedia !== false && (
          <div className="absolute flex flex-col justify-end items-center w-full h-full z-50">
            <div className="text-head3 text-grayscale-200 px-[16px] w-full mb-[10px]">
              Q. {question}
            </div>
          </div>
        )}
      </div>

      {canLoadMedia && !isScriptOpened && (
        <div
          className="flex justify-center items-center bg-grayscale-800 m-[14px] h-[46px] w-[calc(100%-28px)] flex text-head4 text-grayscale-300 rounded-full transition-all active:scale-95"
          onClick={() => setIsScriptOpened(true)}
        >
          무슨 말을 할지 고민이라면 click!
        </div>
      )}

      {canLoadMedia && isScriptOpened && (
        <div
          className="p-[14px] h-full max-h-[calc(100dvh-min(650px,100dvw))] overflow-scroll hide-scrollbar"
          onClick={() => setIsScriptOpened(true)}
        >
          {scriptMapper(topic ?? "").map((script, index) => (
            <div key={"script" + index}>
              <div className="text-grayscale-200 text-body2">{script}</div>
              <div className="h-[26px]" />
            </div>
          ))}
          <div className="h-[20px]" />
        </div>
      )}

      <div className="fixed bottom-[20px] left-1/2 transform -translate-x-1/2 w-full max-w-[650px] flex justify-end items-center z-40">
        <div
          className={`flex justify-center items-center z-50 text-grayscale-white text-head4 px-[16px] mr-[20px] w-[116px] h-[46px] bg-grayscale-700 rounded-full gap-[6px] active:scale-95 transition-all ${
            isCountdownEnd.current ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => {
            endInterview();
          }}
        >
          <Image
            unoptimized
            src="/icons/rec-stop-rectangle.svg"
            width={18}
            height={18}
            alt={"stop recording"}
          />
          <p>녹화 종료</p>
        </div>
      </div>

      <div className="h-[16px] shrink" />

      <div className="grow" />

      <div className="h-[18px]" />
    </div>
  );
}

function scriptMapper(topic: string): string[] {
  return (
    {
      나: [
        "안녕, __아. 지금은 2025년 __월 __일이야. 오늘 나는 __ 기분으로 이 영상을 찍고 있어.",
        "요즘 나는 __(공부, 일, 취미 등)을 하고 있고 하루하루 __ 생각을 하면서 살고 있어.",
        "일년 뒤 나에게 해주고 싶은 말은 __이야. 이 말을 해주고 싶은 이유는 __이야",
        "지금 이 영상을 보는 너는 어떤 삶을 살고 있어? 행복해?",
        "지금 이 순간의 나도, 미래의 너도 다 소중해. 1년 뒤 웃으며 만나자. 사랑해, __아!",
      ],
      불안: [
        "안녕, __아. 지금은 2025년 __월 __일이야. 오늘 나는 __ 기분으로 이 영상을 찍고 있어.",
        "요즘 나는 __(공부, 일, 취미 등)을 하고 있고 하루하루 __ 생각을 하면서 살고 있어.",
        "요즘 가장 많이 하는 고민은 __야. 이게 고민인 이유는 __이야.",
        "지금 이 영상을 보는 너는 어떤 삶을 살고 있어? 행복해?",
        "지금 이 순간의 나도, 미래의 너도 다 소중해. 1년 뒤 웃으며 만나자. 사랑해, __아!",
      ],
      사랑: [
        "안녕, __아. 지금은 2025년 __월 __일이야. 오늘 나는 __ 기분으로 이 영상을 찍고 있어.",
        "요즘 나는 __(공부, 일, 취미 등)을 하고 있고 하루하루 __ 생각을 하면서 살고 있어.",
        "지금 타임캡슐을 만들면서 떠오르는 사람은 __이야. __이 떠오른 이유는 내가 가장 좋아하기 때문이지. 일년 뒤에도 그럴 수 있으면 좋겠어.",
        "지금 이 영상을 보는 너는 어떤 삶을 살고 있어? 행복해?",
        "지금 이 순간의 나도, 미래의 너도 다 소중해. 1년 뒤 웃으며 만나자. 사랑해, __아!",
      ],
      미래: [
        "안녕, __아. 지금은 2025년 __월 __일이야. 오늘 나는 __ 기분으로 이 영상을 찍고 있어.",
        "요즘 나는 __(공부, 일, 취미 등)을 하고 있고 하루하루 __ 생각을 하면서 살고 있어.",
        "1년 뒤의 나는 __ 모습이면 좋겠어. 지금과는 __ 점이 달라지겠지?",
        "지금 이 영상을 보는 너는 어떤 삶을 살고 있어? 행복해?",
        "지금 이 순간의 나도, 미래의 너도 다 소중해. 1년 뒤 웃으며 만나자. 사랑해, __아!",
      ],
      과거: [
        "안녕, __아. 지금은 2025년 __월 __일이야. 오늘 나는 __ 기분으로 이 영상을 찍고 있어.",
        "요즘 나는 __(공부, 일, 취미 등)을 하고 있고 하루하루 __ 생각을 하면서 살고 있어.",
        "나는 과거로 돌아갈 수 있다면 __ 때로 돌아가고 싶어. __ 때로 돌아가고 싶은 이유는 __이야.",
        "지금 이 영상을 보는 너는 어떤 삶을 살고 있어? 행복해?",
        "지금 이 순간의 나도, 미래의 너도 다 소중해. 1년 뒤 웃으며 만나자. 사랑해, __아!",
      ],
      행복: [
        "안녕, __아. 지금은 2025년 __월 __일이야. 오늘 나는 __ 기분으로 이 영상을 찍고 있어.",
        "요즘 나는 __(공부, 일, 취미 등)을 하고 있고 하루하루 __ 생각을 하면서 살고 있어.",
        "최근 가장 행복했던 일은 __이야. __이 나한테 행복했던 이유는 __ 때문이야.",
        "지금 이 영상을 보는 너는 어떤 삶을 살고 있어? 행복해?",
        "지금 이 순간의 나도, 미래의 너도 다 소중해. 1년 뒤 웃으며 만나자. 사랑해, __아!",
      ],
    }[topic] ?? []
  );
}
