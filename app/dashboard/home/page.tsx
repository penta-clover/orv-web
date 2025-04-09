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
    authRepository.isAuthTokenValid().then((isValid) => {
      if (!isValid) {
        router.replace("/");
      }
    })
  }, []);


  useEffect(() => {
    if (window !== undefined && window.innerWidth < 500) {
      router.replace("/error/mobile-not-supported");
    }

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
      <h1 className="text-2xl font-bold text-head0 mx-[40px] mb-[24px]">홈</h1>

      <div className="h-[276px] w-full">
        <VideoList />
      </div>

      {userName && hiddenCategoryCodes.length > 0 && (
        <>
          <div className="h-[48px]" />
          <div className="h-[280px] w-full">
            <TopicList
              title={`${userName}님만을 위한 특별 주제`}
              categoryCode={hiddenCategoryCodes[0]}
            />
          </div>
        </>
      )}

      <div className="h-[48px]" />

      <div className="h-[280px] w-full">
        <TopicList title="주제 보기" categoryCode="DEFAULT" />
      </div>

      <div className="h-[104px]" />

      <div className="fixed bottom-[48px] left-[280px]">
        <ReservationNotification />
      </div>
    </div>
  );
}
