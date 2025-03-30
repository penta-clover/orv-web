"use client";

import "@/app/components/blackBody.css";
import Image from "next/image";
import { CameraComponent } from "../(components)/camera/cameraComponent";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ExitInterviewModal from "../(components)/exitInterviewModal";
import { useStoryboardRepository } from "@/providers/StoryboardRepositoryContext";
import TipBox from "../(components)/tipBox";
import NextButton from "../(components)/nextButton";
import { CanvasRecorder } from "../(components)/camera/canvasRecorder";
import { getCameraStream } from "../(components)/camera/cameraStream";
import {
  createBlankCanvas,
  createFilteredCanvas,
  FilteredCanvasElement,
} from "../(components)/camera/filteredCanvas";
import BackgroundMusic from "./backgroundMusic";

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
  const [sourceCanvas, setSourceCanvas] = useState<
    FilteredCanvasElement | undefined
  >();

  const canvasRecorderRef = useRef<CanvasRecorder | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startTimeRef = useRef<number>(0);
  const router = useRouter();

  const storyboardRepository = useStoryboardRepository();
  const RECORDING_FPS = 24; // 녹화 프레임 레이트 설정

  useEffect(() => {
    canvasRecorderRef.current = new CanvasRecorder();

    if (aspect === "none") {
      setSourceCanvas(createBlankCanvas());
    } else {
      getCameraStream().then((stream) => {
        setSourceCanvas(createFilteredCanvas(stream, filter));
      });
    }

    storyboardRepository.getStoryboardInfo(storyboardId).then((storyboard) => {
      storyboardRepository
        .getSceneInfo(storyboard.startSceneId)
        .then((scene) => {
          loadQuestion(scene.id, 1);

          // 첫 질문이 로드될 때 인터뷰 시작 시간 기록
          startTimeRef.current = Date.now();
          canvasRecorderRef.current?.startRecording(
            canvasRef.current!,
            RECORDING_FPS
          ); // 녹화 시작
        });
    });
  }, []);

  useEffect(() => {
    if (sourceCanvas) {
      sourceCanvas.updateFilter(filter);
    }
  }, [filter]);

  // 질문 불러오기
  const loadQuestion = (sceneId: string, number: number) => {
    storyboardRepository.getSceneInfo(sceneId).then((scene) => {
      if (scene.sceneType !== "END") {
        setQuestionContent({ ...scene.content, number: number });
      } else {
        canvasRecorderRef.current
          ?.stopRecording()
          .then(() => downloadRecording());
      }
    });
  };

  // 녹화된 파일 다운로드 함수
  // 녹화 정지 직후 호출시 recordedChunks가 비어있을 수 있음 (65번째줄 참고)
  const downloadRecording = () => {
    const url = canvasRecorderRef.current?.getBlobUrl();
    if (!url) return;

    // 인터뷰 전체 시간 계산 (초 단위)
    const totalInterviewTime = Math.floor(
      (Date.now() - startTimeRef.current) / 1000
    );

    router.replace(
      `/interview/finish/credit?videoUrl=${url}&storyboardId=${storyboardId}&totalInterviewTime=${totalInterviewTime}`
    );

    canvasRecorderRef.current?.reset();
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

          <div className="h-[10px] flex-shrink-0" />

          <div className="relative flex justify-center items-center w-[90vw] lg:w-[1200px] bg-grayscale-900 rounded-[12px] overflow-hidden">
            <CameraComponent
              ref={canvasRef}
              sourceCanvas={sourceCanvas}
              overlaySrc="/images/studio-lighting-fhd.png"
              drawOver={(ctx) => {
                if (!canvasRef.current) return;
                const x = 35;
                const y = canvasRef.current!.height - 105;
                const gap = 50;

                ctx.font = "22px 'Pretendard-SemiBold'";
                ctx.fillStyle = "white";
                ctx.fillText(
                  `${questionContent?.number ?? 0}번째 질문`,
                  x,
                  y - gap
                );
                ctx.font = "25px 'Pretendard-SemiBold'";
                ctx.fillText(questionContent?.question ?? "", x, y);
              }}
            />
            <div className="absolute h-[60px] bottom-[22px] left-[32px] mr-[32px] text-grayscale-50 text-head2">
              {questionContent?.hint}
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
