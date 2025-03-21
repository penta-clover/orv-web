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
  <Suspense>
    <Body />
  </Suspense>;
}

function Body() {
  const searchParams = useSearchParams();
  const storyboardId = searchParams.get("storyboardId")!;

  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const onNextButtonClick = () => {
    if (ready) {
      router.push(`/interview/setting/step2?storyboardId=${storyboardId}`);
    } else {
      //TODO: 체크박스 누르라고 하기
    }
  };

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
        <StatusBar currentStep={1} />
        <hr className="border-grayscale-700 border-[0.5px] w-full" />
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
        <label
          htmlFor="ready"
          className="flex flex-row items-center h-[24px] gap-[6px] text-body2 text-grayscale-white"
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
        <PrevButton
          className="fixed bottom-[45px] left-[45px]"
          onClick={() => router.back()}
          useKeyboardShortcut
        />
        <div className="fixed bottom-[45px] right-[45px] flex flex-col items-end gap-[10px]">
          <TipBox
            tag="Tip!"
            text="마우스 클릭 혹은 방향키 좌우동작을\n통해 조작하세요!"
            tagColor="text-main-lilac50"
          />
          <NextButton onClick={onNextButtonClick} useKeyboardShortcut />
        </div>
      </div>
    </ExitInterviewModal>
  );
}

function ImageCard(props: { src: string; alt: string; text: string }) {
  const { src, alt, text } = props;
  return (
    <div className="w-[100%] md:w-[400px] p-[16px] bg-grayscale-800 rounded-[12px] flex flex-col items-center gap-[14px]">
      <Image
        src={src}
        alt={alt}
        width={425}
        height={320}
        className="rounded-[8px]"
      />
      <div className="w-[100%] text-body2 text-grayscale-300 whitespace-pre-wrap">
        {text.replaceAll("\\n", "\n")}
      </div>
    </div>
  );
}
