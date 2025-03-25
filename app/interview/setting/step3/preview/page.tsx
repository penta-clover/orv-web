"use client";
import "@/app/components/blackBody.css";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import ExitInterviewModal from "../../../(components)/exitInterviewModal";
import StatusBar from "../../../(components)/statusBar";
import { CameraComponent } from "@/app/interview/(components)/cameraComponent";
import { Suspense } from "react";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onNextButtonClick = () =>
    router.replace(
      `/interview/setting/step4?storyboardId=${storyboardId}&aspect=${aspect}`
    );

  return (
    <ExitInterviewModal
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      onExitInterview={() => router.replace("/")}
    >
      <div className="relative w-full h-[100%] flex flex-col items-center justify-start gap-[42px] mt-[70px]">
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
        <div className="relative flex justify-center items-center h-[476px] w-[1094px] bg-grayscale-900 rounded-[12px] overflow-hidden">
          <div className="w-full h-full">
            <CameraComponent ref={canvasRef} />
          </div>
          <div className="absolute bottom-[32px] left-[32px] text-white">
            <div className="text-head3">질문 순서표시</div>
            <div className="text-head2 leading-1 mt-[8px]">
              "여기는 질문 내용이 들어갈 곳입니다. 이런 식으로 나와요"
              <br />
              "여기는 질문에 대한 추가 질문 및 힌트가 있을 곳 입니다"
            </div>
          </div>
        </div>
        <button
          className="fixed bottom-[45px] px-[24px] py-[14px] bg-main-lilac50 text-head3 rounded-[10px] transition-all active:scale-95 flex flex-row items-center gap-[5px]"
          onClick={onNextButtonClick}
        >
          <Image
            src="/icons/circle-check.svg"
            alt="circle-check"
            width={24}
            height={24}
          />
          확인했어요
        </button>
      </div>
    </ExitInterviewModal>
  );
}
