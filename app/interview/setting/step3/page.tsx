"use client";
import "@/app/components/blackBody.css";
import Image from "next/image";
import NextButton from "../../(components)/nextButton";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import ExitInterviewModal from "../../(components)/exitInterviewModal";
import PrevButton from "../../(components)/prevButton";
import StatusBar from "../../(components)/statusBar";
import { CameraComponent } from "../../(components)/camera/cameraComponent";
import { cn } from "@/lib/utils";
import { getCameraStream } from "../../(components)/camera/cameraStream";
import { createFilteredCanvas } from "../../(components)/camera/filteredCanvas";

export default function Page() {
  return (
    <Suspense>
      <Body />
    </Suspense>
  );
}

function Body() {
  const searchParams = useSearchParams();
  const storyboardId = searchParams.get("storyboardId")!;

  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAspect, setSelectedAspect] = useState<Aspect>("frontal");
  const [sourceCanvas, setSourceCanvas] = useState<
    HTMLCanvasElement | undefined
  >();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    getCameraStream().then((stream) => {
      setSourceCanvas(createFilteredCanvas(stream));
    });
  }, []);

  const onAspectClick = (aspect: Aspect) => {
    setSelectedAspect(aspect);

    router.replace(
      `/interview/setting/step3/preview?storyboardId=${storyboardId}&aspect=${aspect}`
    );
  };

  return (
    <ExitInterviewModal
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      onExitInterview={() => router.replace("/")}
    >
      <div className="relative w-full h-[calc(100dvh)] flex flex-col items-center justify-start">
        <Image
          unoptimized
          src="/icons/x.svg"
          width={32}
          height={32}
          alt="close"
          onClick={() => setIsModalOpen(true)}
          className="fixed top-[10px] right-[10px] px-[16px] py-[12px] w-[64px] h-[56px] focus:outline-none cursor-pointer"
        />

        <div className="h-[40px]" />

        <StatusBar currentStep={3} />

        <div className="h-[24px]" />

        <hr className="border-grayscale-700 border-[0.5px] w-full" />

        <div className="flex flex-col grow items-center justify-center">
          <div className="relative grid grid-rows-2 grid-cols-2 grid-flow-col gap-[20px] h-[60vh]">
            <div className="absolute top-[12px] left-[12px] px-[8px] py-[1px] bg-system-info text-white text-caption1 rounded-[4px] z-20">
              추천
            </div>
            <AspectPreview
              selected={selectedAspect === "frontal"}
              onClick={() => onAspectClick("frontal")}
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
                <CameraComponent ref={canvasRef} sourceCanvas={sourceCanvas} />
              </div>
            </AspectPreview>
            <AspectPreview
              selected={selectedAspect === "whole"}
              onClick={() => onAspectClick("whole")}
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
                <CameraComponent ref={canvasRef} sourceCanvas={sourceCanvas} />
              </div>
            </AspectPreview>
            <AspectPreview
              selected={selectedAspect === "side"}
              onClick={() => onAspectClick("side")}
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
                <CameraComponent ref={canvasRef} sourceCanvas={sourceCanvas} />
              </div>
            </AspectPreview>
            <AspectPreview
              selected={selectedAspect === "none"}
              onClick={() => onAspectClick("none")}
              reverseX={false}
            >
              <div className="flex flex-col items-center justify-center gap-[8px] bg-grayscale-900 rounded-[12px] aspect-[16/9] cursor-pointer">
                <div className="text-head2 text-grayscale-50">
                  화면 없이 검은색 바탕으로 질문만
                </div>
                <div className="text-body3 text-grayscale-300 text-center">
                  *화면에 스스로의 모습이 비치는게 어색한 경우에 추천드려요.
                </div>
              </div>
            </AspectPreview>
          </div>
        </div>
        <div className="w-full h-[104px]">
          <PrevButton
            className="fixed bottom-[45px] left-[45px]"
            onClick={() =>
              router.replace(
                `/interview/setting/step2?storyboardId=${storyboardId}`
              )
            }
            useKeyboardShortcut
          />
        </div>
      </div>
    </ExitInterviewModal>
  );
}

function AspectPreview(props: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  reverseX?: boolean;
}) {
  const { children, selected, onClick, reverseX = true } = props;

  return (
    <div
      className={cn(
        selected ? "border-main-lilac50" : "border-transparent",
        "rounded-[12px] overflow-hidden border-[2px] aspect-[16/9] cursor-pointer relative"
      )}
      onClick={onClick}
      style={{ transform: reverseX ? "scaleX(-1)" : undefined }}
    >
      {children}
    </div>
  );
}
