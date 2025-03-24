"use client";
import "@/app/components/blackBody.css";
import Image from "next/image";
import NextButton from "../../(components)/nextButton";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ExitInterviewModal from "../../(components)/exitInterviewModal";
import PrevButton from "../../(components)/prevButton";
import StatusBar from "../../(components)/statusBar";
import MicIndicator from "./micIndicator";
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
      router.replace(`/interview/setting/step3?storyboardId=${storyboardId}`);
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
        <StatusBar currentStep={2} />
        <hr className="border-grayscale-700 border-[0.5px] w-full" />
        <div>
          <div className="flex flex-row px-[16px]">
            <Image
              unoptimized
              src="/images/airpods.svg"
              width={120}
              height={150}
              alt="earphone"
              className="mx-[10vw] md:mx-[100px]"
            />
            <div className="w-[100%] md:w-[480px] p-[36px] bg-grayscale-800 text-body2 text-grayscale-300 rounded-[12px]">
              블루투스 이어폰을 끼는 것을 추천 드려요! 인터뷰를 진행하며 조용한
              노래가 나와요. 이어폰이 없으시다면 노트북의 마이크 부분이 너무
              멀리 떨어지지 않게 잘 조정해주세요
            </div>
          </div>
          <div className="flex flex-row px-[16px] my-[26px] gap-[40px]">
            <div className="w-[100%] md:w-[450px] p-[36px] bg-grayscale-800 text-body2 text-grayscale-300 rounded-[12px] flex flex-col gap-[54px]">
              <span>
                마이크 테스트를 할 때 옆의{" "}
                <span className="text-system-info">파란 선</span>을 넘는지
                확인해주세요. 다음 내용을 읽으며 테스트해주세요. "오늘의 나를
                기록하기"
              </span>
              <span>
                아무 말도 하지 않을 때{" "}
                <span className="text-system-error">빨간 선</span>을 넘지 않는지
                확인해주세요. 만약 빨간 선을 넘는다면 조금 더 조용한 환경을
                추천드려요.
              </span>
            </div>
            <MicIndicator width={310} height={230} />
          </div>
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
          마이크 테스트를 완료했어요
        </label>
        <PrevButton
          className="fixed bottom-[45px] left-[45px]"
          onClick={() =>
            router.replace(
              `/interview/setting/step1?storyboardId=${storyboardId}`
            )
          }
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
