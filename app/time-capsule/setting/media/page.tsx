"use client";

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import "@/app/components/blackBody.css";
import { Suspense } from "react";

export default function Page() {
  return <Suspense>
    <Body />
  </Suspense>
}

function Body() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic");
  const question = searchParams.get("question");
  const router = useRouter();

  return (
    <div className="flex flex-col relative bg-dark w-full h-[calc(100dvh)]">
      <div className="h-[20dvh] shrink" />

      <div className="text-head1 text-grayscale-white mx-[16px]">
        지금의 내 모습을
        <br />
        영상으로도 기록할까요?
      </div>

      <div className="text-grayscale-300 text-body4 mx-[16px]">
        영상으로 기록하면 지금 나의 표정이나 오늘의 분위기를 더 생생하게 담을 수
        있어요
      </div>

      <div className="h-[45px]" />
      
      <CTA
        text="좋아요! 내 모습도 남겨주세요"
        onClick={() => {
          router.push(`/time-capsule/recording?aspect=frontal&filter=timecapsule&topic=${topic}&question=${question}`);
        }}
        className="w-full h-[48px] mx-[16px] text-head4 bg-main-lilac50"
      />

      <div className="h-[16px]" />

      <CTA
        text="음성만 녹음할게요"
        onClick={() => {
          router.push(`/time-capsule/recording?aspect=none&topic=${topic}&question=${question}`);
        }}
        className="w-full h-[48px] mx-[16px] text-head4 bg-grayscale-50"
      />
      <div className="grow" />
    </div>
  );
}

function CTA(props: { text: string; onClick: () => void; className?: string }) {
  return (
    <div className="w-full flex justify-center">
      <button
        style={{ boxShadow: "0px 0px 12px rgba(197, 209, 255, 0.6)" }}
        className={cn(
          "bg-gd px-[13px] py-[9px] text-grayscale-800 text-head4 rounded-[10px] transition-all active:scale-95",
          props.className
        )}
        onClick={props.onClick}
      >
        {props.text}
      </button>
    </div>
  );
}
