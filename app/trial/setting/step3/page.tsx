"use client";
import "@/app/components/blackBody.css";
import Image from "next/image";
import NextButton from "../../(components)/nextButton";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ExitInterviewModal from "../../(components)/exitInterviewModal";
import PrevButton from "../../(components)/prevButton";
import StatusBar from "../../(components)/statusBar";

export default function Page() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onNextButtonClick = () => router.push("/trial/setting/step4");
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
        <StatusBar currentStep={3} />
        <hr className="border-grayscale-700 border-[0.5px] w-full" />
        <div className="text-body1 text-grayscale-white">STEP3</div>
        <PrevButton
          className="absolute bottom-[24px] left-[28px]"
          onClick={() => router.back()}
          useKeyboardShortcut
        />
        <NextButton
          className="absolute bottom-[24px] right-[28px]"
          onClick={onNextButtonClick}
          useKeyboardShortcut
        />
      </div>
    </ExitInterviewModal>
  );
}
