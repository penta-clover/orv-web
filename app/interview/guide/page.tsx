"use client";

import "@/app/components/blackBody.css";
import Image from "next/image";
import TipBox from "../(components)/tipBox";
import NextButton from "../(components)/nextButton";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import ExitInterviewModal from "../(components)/exitInterviewModal";

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
      router.replace(`/interview/setting/step1?storyboardId=${storyboardId}`);
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
      <div className="relative w-full h-[100vh] flex flex-col items-center justify-center gap-[36px]">
        <Image
          unoptimized
          src="/icons/x.svg"
          width={32}
          height={32}
          alt="close"
          onClick={() => setIsModalOpen(true)}
          className="fixed top-[10px] right-[10px] px-[16px] py-[12px] w-[64px] h-[56px] focus:outline-none cursor-pointer"
        />
        <div className="font-semibold text-[30px] text-grayscale-white">
          인터뷰 시작 전 안내 드려요
        </div>
        <div className="text-body0 text-grayscale-500 text-center">
          인터뷰를 더 편하고 자연스럽게 진행하려면, 미리 질문을 충분히 고민해
          보는 게 좋아요.
          <br />
          생각을 정리해 두면 답변할 때 부담도 줄어들고, 더 자신 있게 이야기할 수
          있답니다.
        </div>
        <label
          htmlFor="ready"
          className="flex flex-row items-center h-[24px] gap-[6px] text-body2 text-grayscale-white mt-[36px]"
        >
          <input
            id="ready"
            type="checkbox"
            suppressHydrationWarning
            className="appearance-none w-[16px] h-[16px] mx-[4px] bg-[url('/icons/checkbox-unchecked.svg')] checked:bg-[url('/icons/checkbox-checked.svg')] transition-all"
            onChange={(e) => setReady(e.target.checked)}
          />
          충분히 고민하고 생각 정리 했어요
        </label>
        <div
          className={`fixed bottom-[45px] right-[45px] flex flex-col items-end gap-[10px] transition-all  ${
            ready ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <NextButton onClick={onNextButtonClick} useKeyboardShortcut />
        </div>
      </div>
    </ExitInterviewModal>
  );
}
