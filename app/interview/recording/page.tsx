"use client";

import "@/app/components/blackBody.css";
import Image from "next/image";
import { SubtitleCanvas } from "../(components)/camera/subtitleCanvas";
import { Suspense, useEffect, useRef, useState } from "react";
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
  const [questionContent, setQuestionContent] = useState<
    QuestionContent | undefined
  >(undefined);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const streamRecorderRef = useRef<StreamRecorder | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);   // 녹화 중 사용자에게 표시되는 캔버스
  const canvasRef = useRef<HTMLCanvasElement | null>(null);          // 녹화되는 캔버스
  const startTimeRef = useRef<number>(0);
  const router = useRouter();

  const storyboardRepository = useStoryboardRepository();
  const RECORDING_FPS = 24; // 녹화 프레임 레이트 설정

  useEffect(() => {
    streamRecorderRef.current = new StreamRecorder();

    getCameraStream().then((stream) => {
      storyboardRepository
        .getStoryboardInfo(storyboardId)
        .then((storyboard) => {
          storyboardRepository
            .getSceneInfo(storyboard.startSceneId)
            .then((scene) => {
              loadQuestion(scene.id, 1);

              // 첫 질문이 로드될 때 인터뷰 시작 시간 기록
              startTimeRef.current = Date.now();
              if (!canvasRef.current) return;

              const captureStream =
                canvasRef.current!.captureStream(RECORDING_FPS);
              streamRecorderRef.current?.startRecording(captureStream); // 녹화 시작

              setStream(stream);
            });
        });
    });
  }, []);

  // 질문 불러오기
  const loadQuestion = (sceneId: string, number: number) => {
    storyboardRepository.getSceneInfo(sceneId).then((scene) => {
      if (scene.sceneType !== "END") {
        setQuestionContent({ ...scene.content, number: number });
      } else {
        streamRecorderRef.current
          ?.stopRecording()
          .then(() => downloadRecording());
      }
    });
  };

  // 녹화된 파일 다운로드 함수
  // 녹화 정지 직후 호출시 recordedChunks가 비어있을 수 있음 (65번째줄 참고)
  const downloadRecording = () => {
    const url = streamRecorderRef.current?.getBlobUrl();
    if (!url) return;

    // 인터뷰 전체 시간 계산 (초 단위)
    const totalInterviewTime = Math.floor(
      (Date.now() - startTimeRef.current) / 1000
    );

    // router.replace(
    //   `/interview/finish/credit?videoUrl=${url}&storyboardId=${storyboardId}&totalInterviewTime=${totalInterviewTime}`
    // );

    const a = document.createElement("a");
    a.href = url;
    a.download = `interview_${totalInterviewTime}s.webm`;
    a.click();

    streamRecorderRef.current?.reset();
  };

  return (
    <ExitInterviewModal
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      onExitInterview={() => router.replace("/")}
    >
      <div className="relative w-full h-[calc(100dvh)] flex flex-col items-center justify-start py-[20px] px-[48px]">
        <div className="flex flex-col grow items-center justify-center">
          <div className="w-[90vw] lg:w-[1200px] flex justify-end">
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

          <div className="relative flex justify-center items-center w-[90vw] lg:w-[1200px] bg-grayscale-900 rounded-[12px] overflow-hidden">
            {aspect === "none" ? (
              <BlankCanvas
                ref={previewCanvasRef}
                overlay="/images/studio-lighting-fhd.png"
              />
            ) : (
              <FilteredCanvas
                stream={stream!}
                filter={filter}
                ref={previewCanvasRef}
                overlay="/images/studio-lighting-fhd.png"
              />
            )}
            <SubtitleCanvas
              ref={canvasRef}
              sourceCanvasRef={previewCanvasRef}
              subtitles={[
                {
                  text: `${questionContent?.number ?? 0}번째 질문`,
                  x: 50,
                  y: -110,
                  fontSize: 25,
                  color: "white",
                },
                {
                  text: questionContent?.question ?? "",
                  x: 50,
                  y: -60,
                  fontSize: 30,
                  color: "white",
                },
              ]}
              style={{
                width: "0",
                height: "0",
                position: "absolute",
                opacity: "0",
                pointerEvents: "none",
              }}
              fps={RECORDING_FPS}
            />

            <div className="absolute bottom-[32px] left-[32px] mr-[32px] text-white">
              <div className="text-head3">
                {questionContent?.number}번째 질문
              </div>
              <div className="text-head2 leading-1 mt-[8px]">
                {questionContent?.question}
                <br />
                {questionContent?.hint}
              </div>
            </div>

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
                  if (questionContent?.nextSceneId) {
                    loadQuestion(
                      questionContent!.nextSceneId,
                      questionContent!.number + 1
                    );
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
          </div>
        </div>
      </div>
    </ExitInterviewModal>
  );
}
