"use client";
import "@/app/components/blackBody.css";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import ExitInterviewModal from "../../(components)/exitInterviewModal";
import PrevButton from "../../(components)/prevButton";
import StatusBar from "../../(components)/statusBar";
import { getCameraStream } from "../../(components)/camera/cameraStream";
import { FilteredCanvas } from "../../(components)/camera/filteredCanvas";
import { AspectPreview } from "./aspectPreview";
import usePermissionReload from "../../(components)/usePermissionReload";
import { getPermissionGuideText } from "../../(components)/getPermissionGuideText";

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
  const [stream, setStream] = useState<MediaStream | undefined>();
  const [streamReady, setStreamReady] = useState(false);

  usePermissionReload("camera");
  usePermissionReload("microphone");

  useEffect(() => {
    getCameraStream({ useAudio: false })
      .then((stream) => {
        setStream(stream);
        setStreamReady(true);
      })
      .catch((error) => {
        alert(getPermissionGuideText());
      });
  }, []);

  const onAspectClick = (aspect: Aspect) => {
    setSelectedAspect(aspect);
    setStreamReady(false);

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

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

        <div className="h-[20px]" />

        <StatusBar currentStep={3} />

        <div className="h-[15px]" />

        <hr className="border-grayscale-700 border-[0.5px] w-full" />

        <div className="flex flex-col grow items-center justify-center">
          <div className="relative grid grid-rows-2 grid-cols-2 grid-flow-col gap-[20px] h-[60vh]">
            <div className="absolute top-[12px] left-[12px] px-[8px] py-[1px] bg-system-info text-white text-caption1 rounded-[4px] z-20">
              추천
            </div>
            <AspectPreview
              onClick={() => onAspectClick("frontal")}
              disabled={!streamReady}
            >
              <Image
                src="https://d3bdjeyz3ry3pi.cloudfront.net/static/images/frontal-contour.svg"
                unoptimized
                width={100}
                height={100}
                alt="frontal"
                className="absolute bottom-[0] w-full h-[87%] object-contain z-10"
                draggable={false}
              />
              <div className="absolute top-0 left-0 w-full h-full opacity-50">
                <FilteredCanvas
                  stream={stream}
                  overlay="/images/studio-lighting-fhd.png"
                />
              </div>
            </AspectPreview>
            <AspectPreview
              onClick={() => onAspectClick("whole")}
              disabled={!streamReady}
            >
              <Image
                src="https://d3bdjeyz3ry3pi.cloudfront.net/static/images/whole-contour.svg"
                unoptimized
                width={100}
                height={100}
                alt="whole"
                className="absolute bottom-[0] w-full h-[87%] object-contain z-10"
                draggable={false}
              />
              <div className="absolute top-0 left-0 w-full h-full opacity-50">
                <FilteredCanvas
                  stream={stream}
                  overlay="/images/studio-lighting-fhd.png"
                />
              </div>
            </AspectPreview>
            <AspectPreview
              onClick={() => onAspectClick("side")}
              disabled={!streamReady}
            >
              <Image
                src="https://d3bdjeyz3ry3pi.cloudfront.net/static/images/side-contour.svg"
                unoptimized
                width={100}
                height={100}
                alt="side"
                className="absolute bottom-[0] w-full h-[78%] object-contain z-10"
                draggable={false}
              />
              <div className="absolute top-0 left-0 w-full h-full opacity-50">
                <FilteredCanvas
                  stream={stream}
                  overlay="/images/studio-lighting-fhd.png"
                />
              </div>
            </AspectPreview>
            <AspectPreview
              onClick={() => onAspectClick("none")}
              disabled={!streamReady}
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

          <div className="fixed bottom-[56px] left-1/2 transform -translate-x-1/2 text-head2 text-grayscale-white">
            원하는 화면 각도를 클릭해 크게 확인해보세요.
          </div>
        </div>
      </div>
    </ExitInterviewModal>
  );
}


