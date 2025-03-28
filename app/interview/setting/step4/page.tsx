"use client";
import "@/app/components/blackBody.css";
import Image from "next/image";
import NextButton from "../../(components)/nextButton";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react";
import ExitInterviewModal from "../../(components)/exitInterviewModal";
import PrevButton from "../../(components)/prevButton";
import StatusBar from "../../(components)/statusBar";
import { CameraComponent } from "@/app/interview/(components)/camera/cameraComponent";
import TipBox from "../../(components)/tipBox";
import { cn } from "@/lib/utils";
import { getCameraStream } from "@/app/interview/(components)/camera/cameraStream";
import {
  createFilteredCanvas,
  FilteredCanvasElement,
} from "@/app/interview/(components)/camera/filteredCanvas";

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
  const aspect = searchParams.get("aspect")!;

  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<Filter>("default");
  const [sourceCanvas, setSourceCanvas] = useState<
    FilteredCanvasElement | undefined
  >();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onNextButtonClick = () =>
    router.replace(
      `/interview/setting/ready?storyboardId=${storyboardId}&aspect=${aspect}&filter=${filter}`
    );

  useEffect(() => {
    getCameraStream().then((stream) => {
      setSourceCanvas(createFilteredCanvas(stream, filter));
    });
  }, []);

  useEffect(() => {
    if (sourceCanvas) {
      sourceCanvas.updateFilter(filter);
    }
  }, [filter]);

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

        <StatusBar currentStep={4} />

        <div className="h-[24px]" />

        <hr className="border-grayscale-700 border-[0.5px] w-full" />

        <div className="flex flex-col grow items-center justify-center">
          <div className="flex flex-col gap-[20px] items-center">
            <div className="relative flex justify-center items-center h-[430px] w-[846px] bg-grayscale-900 rounded-[12px] overflow-hidden">
              <div
                className="w-full h-full"
                style={{ transform: "scaleX(-1)" }}
              >
                <CameraComponent ref={canvasRef} sourceCanvas={sourceCanvas} />
              </div>
              <div className="absolute top-[16px] left-[16px] text-head4 text-white">
                필터 미리보기
              </div>
            </div>
            <div className="flex flex-row items-center gap-[16px]">
              <FilterButton
                selected={filter === "default"}
                onClick={() => {
                  setFilter("default");
                }}
              >
                기본
              </FilterButton>
              <FilterButton
                selected={filter === "monotone"}
                onClick={() => {
                  setFilter("monotone");
                }}
              >
                모노톤
              </FilterButton>
              <FilterButton
                selected={filter === "bright"}
                onClick={() => {
                  setFilter("bright");
                }}
              >
                밝기 증가
              </FilterButton>
              <FilterButton
                selected={filter === "natural"}
                onClick={() => {
                  setFilter("natural");
                }}
              >
                네추럴
              </FilterButton>
              <FilterButton
                selected={filter === "soft"}
                onClick={() => {
                  setFilter("soft");
                }}
              >
                소프트
              </FilterButton>
              <FilterButton
                selected={filter === "lark"}
                onClick={() => {
                  setFilter("lark");
                }}
              >
                Lark
              </FilterButton>
            </div>
          </div>
        </div>
        <PrevButton
          className="fixed bottom-[45px] left-[45px]"
          onClick={() =>
            router.replace(
              `/interview/setting/step3?storyboardId=${storyboardId}&aspect=${aspect}`
            )
          }
          useKeyboardShortcut
        />
        <div className="fixed bottom-[45px] right-[45px] flex flex-col items-end gap-[10px]">
          <TipBox
            tag="Notice"
            text="인터뷰가 바로 시작돼요.\n이제 다음 단계로 넘어가면 다시 돌아올 수 없어요"
            tagColor="text-system-warning"
            dismissOnClick
          />
          <NextButton onClick={onNextButtonClick} useKeyboardShortcut />
        </div>
      </div>
    </ExitInterviewModal>
  );
}

function FilterButton(props: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  const { children, selected, onClick } = props;

  return (
    <button
      className={cn(
        selected ? "bg-grayscale-50" : "bg-grayscale-800",
        "w-[146px] h-[44px] text-head4 rounded-[12px] flex justify-center items-center"
      )}
      style={{ color: selected ? "#28282F" : "#80808A" }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
