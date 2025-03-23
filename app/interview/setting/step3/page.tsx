"use client";
import "@/app/components/blackBody.css";
import Image from "next/image";
import NextButton from "../../(components)/nextButton";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useRef, useState } from "react";
import ExitInterviewModal from "../../(components)/exitInterviewModal";
import PrevButton from "../../(components)/prevButton";
import StatusBar from "../../(components)/statusBar";
import { CameraComponent } from "../../(components)/cameraComponent";
import { cn } from "@/lib/utils";

export default function Page() {
  <Suspense>
    <Body />
  </Suspense>;
}

function Body() {
  const searchParams = useSearchParams();
  const storyboardId = searchParams.get("storyboardId")!;

  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAspect, setSelectedAspect] = useState<string>("frontal");
  const videoRef = useRef<HTMLVideoElement>(null);

  const onAspectClick = (aspect: string) => {
    setSelectedAspect(aspect);
  };

  const onNextButtonClick = () =>
    router.push(
      `/interview/setting/step3/preview?storyboardId=${storyboardId}&aspect=${selectedAspect}`
    );

  return (
    <ExitInterviewModal
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      onExitInterview={() => router.push("/")}
    >
      <div className="relative w-full h-[100svh] flex flex-col items-center justify-start gap-[42px] mt-[70px]">
        <Image
          unoptimized
          src="/icons/x.svg"
          width={32}
          height={32}
          alt="close"
          onClick={() => setIsModalOpen(true)}
          className="fixed top-[10px] right-[10px] px-[16px] py-[12px] w-[64px] h-[56px] focus:outline-none cursor-pointer"
        />
        <StatusBar currentStep={3} />
        <hr className="border-grayscale-700 border-[0.5px] w-full" />
        <div className="relative grid grid-rows-2 grid-flow-col gap-[20px] h-[60vh]">
          <div className="absolute top-[12px] left-[12px] px-[8px] py-[1px] bg-system-info text-white text-caption1 rounded-[4px] z-20">
            추천
          </div>
          <AspectPreview
            selected={selectedAspect === "frontal"}
            onClick={() => onAspectClick("frontal")}
            inverse
          >
            <Image
              src="/images/pose-guide-frontal.png"
              width={100}
              height={100}
              alt="frontal"
              className="w-full h-full object-cover absolute z-10"
              draggable={false}
            />
            <div className="absolute top-0 left-0 w-full h-full">
              <CameraComponent ref={videoRef} />
            </div>
          </AspectPreview>
          <AspectPreview
            selected={selectedAspect === "whole"}
            onClick={() => onAspectClick("whole")}
            inverse
          >
            <Image
              src="/images/pose-guide-whole.png"
              width={100}
              height={100}
              alt="whole"
              className="w-full h-full object-cover absolute z-10"
              draggable={false}
            />
            <div className="absolute top-0 left-0 w-full h-full">
              <CameraComponent ref={videoRef} />
            </div>
          </AspectPreview>
          <AspectPreview
            selected={selectedAspect === "side"}
            onClick={() => onAspectClick("side")}
            inverse
          >
            <Image
              src="/images/pose-guide-side.png"
              width={100}
              height={100}
              alt="side"
              className="w-full h-full object-cover absolute z-10"
              draggable={false}
            />
            <div className="absolute top-0 left-0 w-full h-full">
              <CameraComponent ref={videoRef} />
            </div>
          </AspectPreview>
          <AspectPreview
            selected={selectedAspect === "none"}
            onClick={() => onAspectClick("none")}
          >
            <div className="flex flex-col items-center justify-center gap-[8px] bg-grayscale-900 rounded-[12px] aspect-[16/9] cursor-pointer">
              <div className="text-head2 text-grayscale-50">
                화면 없이 검은색 바탕으로 질문만
              </div>
              <div className="text-body2 text-grayscale-300">
                *화면에 스스로의 모습이 비치는게 어색한 경우에 추천드려요.
              </div>
            </div>
          </AspectPreview>
        </div>
        <PrevButton
          className="fixed bottom-[45px] left-[45px]"
          onClick={() => router.back()}
          useKeyboardShortcut
        />
        <NextButton
          className="fixed bottom-[45px] right-[45px]"
          onClick={onNextButtonClick}
          useKeyboardShortcut
        />
      </div>
    </ExitInterviewModal>
  );
}

function AspectPreview(props: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  inverse?: boolean;
}) {
  const { children, selected, onClick, inverse = false } = props;

  return (
    <div
      className={cn(
        selected ? "border-main-lilac50" : "border-transparent",
        "rounded-[12px] overflow-hidden border-[2px] aspect-[16/9] cursor-pointer"
      )}
      style={{ transform: inverse ? "scaleX(-1)" : "scaleX(1)" }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
