"use client";
import "@/app/components/blackBody.css";
import Image from "next/image";
import TipBox from "../../(components)/tipBox";
import NextButton from "../../(components)/nextButton";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ExitInterviewModal from "../../(components)/exitInterviewModal";
import PrevButton from "../../(components)/prevButton";
import StatusBar from "../../(components)/statusBar";

export default function Page() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onNextButtonClick = () => {
    if (ready) {
      router.push("/trial/setting/step3");
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
      <div className="relative w-full h-[100svh] flex flex-col items-center justify-center gap-[42px]">
        <Image
          unoptimized
          src="/icons/x.svg"
          width={32}
          height={32}
          alt="close"
          onClick={() => setIsModalOpen(true)}
          className="absolute top-0 right-0 px-[16px] py-[12px] w-[64px] h-[56px] focus:outline-none cursor-pointer"
        />
        <StatusBar currentStep={2} />
        <hr className="border-grayscale-700 border-[0.5px] w-full" />
        {/* TODO */}
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
          마이크 테스트를 완료했어요
        </label>
        <PrevButton
          className="absolute bottom-[24px] left-[28px]"
          onClick={() => router.back()}
          useKeyboardShortcut
        />
        <NextButton
          className="absolute bottom-[24px] right-[28px]"
          onClick={() => onNextButtonClick}
          useKeyboardShortcut
        />
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
