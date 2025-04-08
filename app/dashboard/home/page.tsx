"use client";

import "@/app/components/blackBody.css";
import VideoList from "./videoList";
import TopicList from "./topicList";
import { usePopup } from "../popup";
import ReservationNotification from "./reservationNotification";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    if (window !== undefined && window.innerWidth < 500) {
      router.replace("/error/mobile-not-supported");
    }
  }, []);

  return (
    <div className="relative text-grayscale-white w-full h-full pt-[78px] overflow-scroll hide-scrollbar">
      <h1 className="text-2xl font-bold text-head0 mx-[40px] mb-[24px]">홈</h1>

      <div className="h-[276px] w-full">
        <VideoList />
      </div>

      <div className="h-[48px]" />

      <div className="h-[280px] w-full">
        <TopicList />
      </div>

      <div className="h-[104px]" />

      <div className="fixed bottom-[48px] left-[280px]">
        <ReservationNotification />
      </div>
    </div>
  );
}
