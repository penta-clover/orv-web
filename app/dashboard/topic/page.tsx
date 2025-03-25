"use client";

import "@/app/components/blackBody.css";
import TopicList from "./topicList";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { usePopup } from "../popup";

export default function Page() {
  return (
    <Suspense>
      <Body />
    </Suspense>
  );
}

function Body() {
  const searchParams = useSearchParams();
  const guidePopupOption = searchParams.get("guide-popup");
  const { showPopup, hidePopup } = usePopup();

  useEffect(() => {
    if (guidePopupOption === "true") {
      showPopup(<SelectGuidePopup />);
    } else {
      hidePopup();
    }
  }, [guidePopupOption, showPopup, hidePopup]);

  return (
    <div className="relative text-grayscale-white w-full h-full pt-[78px] overflow-scroll hide-scrollbar">
      <h1 className="text-2xl font-bold text-head0 mx-[40px] mb-[24px]">
        인터뷰 주제
      </h1>

      <div className="h-[276px] w-full">
        <TopicList />
      </div>
    </div>
  );
}


function SelectGuidePopup() {
  return (
    <div className="flex flex-col justify-center items-center gap-[8px] bg-grayscale-800 text-grayscale-200 w-[952px] max-w-[calc(90dvw)] h-[118px] p-[24px] rounded-[16px]">
      <span className="text-grayscale-50 text-head1">
        인터뷰 주제를 선택해주세요
      </span>
      <span className="text-grayscale-300 text-body2">
        한번 선택한 주제는 도중에 바꿀 수 없어요
      </span>
    </div>
  );
}