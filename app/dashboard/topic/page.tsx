"use client";

import "@/app/components/blackBody.css";
import TopicList from "../../components/topicList";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePopup } from "../popup";
import NewbiewGuidePopup from "../popup/newbieGuidePopup";
import SelectGuidePopup from "../popup/selectGuidePopup";
import { useMemberRepository } from "@/providers/MemberRepositoryContext";

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
  const [userName, setUserName] = useState("");
  const [hiddenCategoryCodes, setHiddenCategoryCodes] = useState<string[]>([]);

  const memberRepository = useMemberRepository();

  useEffect(() => {
    memberRepository.getMyInfo().then((res) => {
      setUserName(res.nickname);
    });

    // localstorage에서 hidden-category-codes가져오기
    const hiddenCategoryCodes = localStorage.getItem("hidden-category-codes");
    if (hiddenCategoryCodes) {
      setHiddenCategoryCodes(JSON.parse(hiddenCategoryCodes));
    }
  }, []);

  useEffect(() => {
    if (guidePopupOption === "first") {
      showPopup(
        <NewbiewGuidePopup
          onClickReservation={() => {
            showPopup(
              <FadeOutWrapper onFadeComplete={hidePopup}>
                <SelectGuidePopup />
              </FadeOutWrapper>
            );
          }}
          onClickStart={() => {
            showPopup(
              <FadeOutWrapper onFadeComplete={hidePopup}>
                <SelectGuidePopup />
              </FadeOutWrapper>
            );
          }}
        />
      );
    } else if (guidePopupOption === "default") {
      showPopup(
        <FadeOutWrapper onFadeComplete={hidePopup}>
          <SelectGuidePopup />
        </FadeOutWrapper>
      );
    }
  }, [guidePopupOption, showPopup, hidePopup]);

  return (
    <div className="relative text-grayscale-white w-full h-full pt-[78px] overflow-scroll hide-scrollbar">
      <h1 className="text-2xl font-bold text-head0 mx-[40px] mb-[24px]">
        인터뷰 주제
      </h1>

      {userName && hiddenCategoryCodes.length > 0 && (
        <>
          <div className="h-[280px] w-full">
            <TopicList
              title={`${userName}님만을 위한 특별 주제`}
              categoryCode={hiddenCategoryCodes[0]}
            />
          </div>

          <div className="h-[48px]" />
        </>
      )}

      <div className="h-[276px] w-full">
        <TopicList title="기본 주제" categoryCode="DEFAULT" />
      </div>

      <div className="h-[104px]" />
    </div>
  );
}

function FadeOutWrapper({
  children,
  onFadeComplete,
}: {
  children: React.ReactNode;
  onFadeComplete?: () => void;
}) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 2500); // 2.5초 후 fade-out 시작

    const completeTimer = setTimeout(() => {
      if (onFadeComplete) onFadeComplete();
    }, 3000); // 2.5초 후 시작해서 0.5초 fade-out 후

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onFadeComplete]);

  return (
    <div
      className={`transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {children}
    </div>
  );
}
