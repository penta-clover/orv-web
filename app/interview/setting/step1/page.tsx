"use client";
import "@/app/components/blackBody.css";
import Image from "next/image";
import TipBox from "../../(components)/tipBox";
import NextButton from "../../(components)/nextButton";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ExitInterviewModal from "../../(components)/exitInterviewModal";
import PrevButton from "../../(components)/prevButton";
import StatusBar from "../../(components)/statusBar";
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

  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const onNextButtonClick = () => {
    if (ready) {
      router.replace(`/interview/setting/step2?storyboardId=${storyboardId}`);
    } else {
      //TODO: 체크박스 누르라고 하기
    }
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

        <StatusBar currentStep={1} />

        <div className="h-[15px]" />

        <hr className="border-grayscale-700 border-[0.5px] w-full" />

        <div className="flex flex-col grow items-center justify-center mb-[100px] h700:mb-[50px] h650:mb-[0px]">
          <div className="flex flex-row gap-[30px] px-[20px]">
            <ImageCard
              src="/images/setting-place-guide-1.jpg"
              alt="place example 1"
              text="인터뷰는 나를 마주하는 시간입니다.\n이를 방해 받지 않기 위해\n혼자만의 조용한 공간을 마련해주세요!\n내 방 혹은 조용한 공간, 나만의 아지트 어디든 좋아요."
            />
            <ImageCard
              src="/images/setting-place-guide-2.jpg"
              alt="place example 2"
              text="아로마, 인센스 스틱이나 내가 제일 좋아하는 잠옷, 쿠션 등과 함께 해도 좋아요. 심리적으로 가장 편한 상황을 조성해서 스스로에게 몰입할 수 있는 환경을 만들어주세요."
            />
          </div>

          <div className="h-[43px]" />

          <label
            htmlFor="ready"
            className="flex flex-row items-center h-[24px] gap-[6px] text-body2 text-grayscale-white z-10"
          >
            <input
              id="ready"
              type="checkbox"
              suppressHydrationWarning
              className="appearance-none w-[16px] h-[16px] mx-[4px] bg-[url('/icons/checkbox-unchecked.svg')] checked:bg-[url('/icons/checkbox-checked.svg')] transition-all"
              onChange={(e) => setReady(e.target.checked)}
            />
            혼자만의 환경을 준비했어요
          </label>
        </div>
        <div className="absolute bottom-0 w-full h-[104px]">
          <PrevButton
            className="fixed bottom-[45px] left-[45px]"
            onClick={() =>
              router.replace(`/interview/guide?storyboardId=${storyboardId}`)
            }
            useKeyboardShortcut
          />
          <div
            className={`fixed bottom-[45px] right-[45px] flex flex-col items-end gap-[10px] transition-all  ${
              ready ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <NextButton onClick={onNextButtonClick} useKeyboardShortcut />
          </div>
        </div>
      </div>
    </ExitInterviewModal>
  );
}

function ImageCard(props: { src: string; alt: string; text: string }) {
  const { src, alt, text } = props;
  return (
    <div className="w-[100%] w700:w-[350px] max-w-[461px] h-[490px] h800:h-[440px] h750:h-[390px] p-[18px] bg-grayscale-800 rounded-[12px] flex flex-col items-center">
      <Image
        unoptimized
        src={src}
        alt={alt}
        width={0}
        height={0}
        className="rounded-[8px] w-full h-[320px] h800:h-[280px] h750:h-[230px]"
      />

      <div className="h-[14px]" />
      <div className="w-full text-body2 text-grayscale-300 whitespace-pre-wrap">
        {text.replaceAll("\\n", "\n")}
      </div>
    </div>
  );
}
