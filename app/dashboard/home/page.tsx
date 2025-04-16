"use client";

import "@/app/components/blackBody.css";
import VideoList from "./videoList";
import TopicList from "@/app/components/topicList";
import ReservationNotification from "./reservationNotification";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMemberRepository } from "@/providers/MemberRepositoryContext";
import { useAuthRepository } from "@/providers/AuthRepositoryContext";

export default function Page() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [hiddenCategoryCodes, setHiddenCategoryCodes] = useState<string[]>([]);

  const memberRepository = useMemberRepository();
  const authRepository = useAuthRepository();

  useEffect(() => {
    const isTokenValid = authRepository.isTokenValid();
    if (!isTokenValid) {
      router.replace("/");
    }
  }, []);

  useEffect(() => {
    // 모바일 미지원 해제
    // if (window !== undefined && window.innerWidth < 500) {
    //   router.replace("/error/mobile-not-supported");
    // }

    memberRepository.getMyInfo().then((res) => {
      setUserName(res.nickname);
    });

    // localstorage에서 hidden-category-codes가져오기
    const hiddenCategoryCodes = localStorage.getItem("hidden-category-codes");
    if (hiddenCategoryCodes) {
      setHiddenCategoryCodes(JSON.parse(hiddenCategoryCodes));
    }
  }, []);

  return (
    <div className="relative text-grayscale-white w-full h-full pt-[78px] overflow-scroll hide-scrollbar">
      <h1 className="text-2xl font-bold text-head0 mx-[20px] xs:mx-[40px] mb-[24px]">
        홈
      </h1>

      <div className="h-[276px] w-full">
        <VideoList
          titleClassName="mx-[20px] xs:mx-[40px]"
          listClassName="px-[20px] xs:px-[40px]"
          showAdditionButton={typeof window !== "undefined" && window.innerWidth >= 480}
        />
      </div>

      {userName && hiddenCategoryCodes.length > 0 && (
        <>
          <div className="h-[24px] xs:h-[48px]" />
          <div className="h-[280px] w-full">
            <TopicList
              title={`${userName}님만을 위한 특별 주제`}
              categoryCode={hiddenCategoryCodes}
              itemClassName="border-[1.5px] border-main-lilac50"
              titleClassName="ml-[20px] xs:ml-[40px]"
              listClassName="px-[20px] xs:px-[40px]"
            />
          </div>
        </>
      )}

      <div className="h-[24px] xs:h-[48px]" />

      <div className="h-[280px] w-full">
        <TopicList
          title="주제 보기"
          categoryCode={["DEFAULT"]}
          titleClassName="ml-[20px] xs:ml-[40px]"
          listClassName="px-[20px] xs:px-[40px]"
        />
      </div>

      <div className="h-[24px] xs:h-[104px]" />

      <div className="fixed bottom-[48px] left-[280px] hidden xs:block">
        <ReservationNotification />
      </div>
    </div>
  );
}
