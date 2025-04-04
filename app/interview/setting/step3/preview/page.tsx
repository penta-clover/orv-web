"use client";
import "@/app/components/blackBody.css";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import ExitInterviewModal from "../../../(components)/exitInterviewModal";
import StatusBar from "../../../(components)/statusBar";
import { Suspense } from "react";
import PrevButton from "@/app/interview/(components)/prevButton";
import NextButton from "@/app/interview/(components)/nextButton";
import { getCameraStream } from "@/app/interview/(components)/camera/cameraStream";
import { FilteredCanvas } from "@/app/interview/(components)/camera/filteredCanvas";
import { getPermissionGuideText } from "@/app/interview/(components)/getPermissionGuideText";
import usePermissionReload from "@/app/interview/(components)/usePermissionReload";

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
  const [stream, setStream] = useState<MediaStream | undefined>();
  const [streamReady, setStreamReady] = useState(false);

  usePermissionReload("camera");
  usePermissionReload("microphone");

  const onNextButtonClick = () =>
    router.replace(
      `/interview/setting/step4?storyboardId=${storyboardId}&aspect=${aspect}`
    );

  useEffect(() => {
    getCameraStream()
      .then((stream) => {
        setStream(stream);
        setStreamReady(true);
      })
      .catch((error) => {
        alert(getPermissionGuideText());
      });
  }, []);

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

        <div className="h-[20px]" />

        <StatusBar currentStep={3} />

        <div className="h-[15px]" />

        <hr className="border-grayscale-700 border-[0.5px] w-full" />

        <div className="flex flex-col grow items-center justify-center">
          <div className="relative flex justify-center items-center h650:h-[350px] h700:h-[400px] h750:h-[450px] h-[65dvh] aspect-16/9 bg-grayscale-900 rounded-[12px] overflow-hidden">
            {aspect !== "none" &&
              (streamReady ? (
                <FilteredCanvas
                  stream={stream}
                  overlay="/images/studio-lighting-fhd.png"
                />
              ) : (
                <CanvasSkeleton />
              ))}
            <div className="absolute bottom-[32px] left-[32px] text-white">
              <div className="text-head3">질문 순서표시</div>
              <div className="mt-[8px]">
                <span className="text-head2">"여기는 질문 내용이 들어갈 곳입니다. 이런 식으로 나와요"</span>
                <br />
                <span className="text-head2 font-normal">"여기는 질문에 대한 추가 질문 및 힌트가 있을 곳 입니다"</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-[104px]">
          <PrevButton
            className="fixed bottom-[45px] left-1/2 transform -translate-x-1/2 "
            onClick={() =>
              router.replace(
                `/interview/setting/step3?storyboardId=${storyboardId}`
              )
            }
            useKeyboardShortcut
          >
            돌아가기
          </PrevButton>
          <NextButton
            className="fixed bottom-[45px] right-[45px]"
            onClick={onNextButtonClick}
            useKeyboardShortcut
          />
        </div>
      </div>
    </ExitInterviewModal>
  );
}

function CanvasSkeleton() {
  return (
    <div className="absolute inset-0 bg-grayscale-900 animate-skeleton-wave">
      <div className="absolute inset-0 bg-gradient-to-r from-grayscale-900 via-grayscale-700 to-grayscale-900 animate-skeleton-wave" />
    </div>
  );
}
