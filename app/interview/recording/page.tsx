"use client";

import "@/app/components/blackBody.css";
import Image from "next/image";
import { CameraComponent } from "../(components)/cameraComponent";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import ExitInterviewModal from "../(components)/exitInterviewModal";
import { useStoryboardRepository } from "@/providers/StoryboardRepositoryContext";
import TipBox from "../(components)/tipBox";
import NextButton from "../(components)/nextButton";
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
  const aspect = searchParams.get("aspect")!;
  const filter = searchParams.get("filter")! as Filter;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showTip, setShowTip] = useState<boolean>(true);
  const [recording, setRecording] = useState<boolean>(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [questionContent, setQuestionContent] = useState<
    QuestionContent | undefined
  >(undefined);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startTimeRef = useRef<number>(0);
  const router = useRouter();

  const storyboardRepository = useStoryboardRepository();
  const RECORDING_FPS = 24; // 녹화 프레임 레이트 설정

  useEffect(() => {
    storyboardRepository.getStoryboardInfo(storyboardId).then((storyboard) => {
      storyboardRepository
        .getSceneInfo(storyboard.startSceneId)
        .then((scene) => {
          loadQuestion(scene.id, 1);

          // 첫 질문이 로드될 때 인터뷰 시작 시간 기록
          startTimeRef.current = Date.now();
          startRecording(); // 녹화 시작
        });
    });
  }, []);

  useEffect(() => {
    downloadRecording();
  }, [recordedChunks]);

  // 질문 불러오기
  const loadQuestion = (sceneId: string, number: number) => {
    storyboardRepository.getSceneInfo(sceneId).then((scene) => {
      if (scene.sceneType !== "END") {
        setQuestionContent({ ...scene.content, number: number });
      } else {
        stopRecording();
      }
    });
  };

  // 녹화 시작 함수
  const startRecording = () => {
    if (!canvasRef.current) return;

    try {
      // canvas의 스트림을 가져옵니다
      const stream = canvasRef.current.captureStream(RECORDING_FPS); // 설정된 FPS로 캡처

      // 오디오 트랙 추가
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((audioStream) => {
          const audioTrack = audioStream.getAudioTracks()[0];
          stream.addTrack(audioTrack);

          const recorder = new MediaRecorder(stream, {
            mimeType: "video/webm; codecs=vp9,opus",
          });
          mediaRecorderRef.current = recorder;
          recorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
              setRecordedChunks((prev) => [...prev, event.data]);
            }
          };
          recorder.start();
          setRecording(true);
        })
        .catch((error) => {
          console.error("오디오 스트림 가져오기 실패:", error);
        });
    } catch (error) {
      console.error("녹화 시작 에러:", error);
    }
  };

  // 녹화 중지 함수
  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  // 녹화된 파일 다운로드 함수
  // 녹화 정지 직후 호출시 recordedChunks가 비어있을 수 있음 (65번째줄 참고)
  const downloadRecording = () => {
    if (recordedChunks.length === 0) return;
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);

    // 인터뷰 전체 시간 계산 (초 단위)
    const totalInterviewTime = Math.floor(
      (Date.now() - startTimeRef.current) / 1000
    );

    router.replace(
      `/interview/finish/credit?videoUrl=${url}&storyboardId=${storyboardId}&totalInterviewTime=${totalInterviewTime}`
    );

    setRecordedChunks([]); // 다운로드 후 초기화
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
            <div
              className={cn(aspect === "none" && "hidden", "w-full h-full")}
              style={{ transform: "scaleX(-1)" }}
            >
              <CameraComponent
                ref={canvasRef}
                filter={filter}
                afterDraw={(ctx) => {
                  if (!canvasRef.current) return;
                  const x = 50;
                  const y = canvasRef.current!.height - 60;
                  const gap = 50;

                  ctx.font = "30px 'Pretendard-SemiBold'";
                  ctx.fillStyle = "white";
                  ctx.fillText(
                    `${questionContent?.number ?? 0}번째 질문`,
                    x,
                    y - gap
                  );
                  ctx.fillText(questionContent?.question ?? "", x, y);
                }}
              />
            </div>
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
                />
              )}
              <NextButton
                onClick={() => {
                  if (questionContent?.nextSceneId) {
                    loadQuestion(
                      questionContent!.nextSceneId,
                      questionContent!.number + 1
                    );
                  } else {
                    stopRecording();
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
