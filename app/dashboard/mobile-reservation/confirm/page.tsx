"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

import "@/app/components/blackBody.css";
import Image from "next/image";

export default function Page() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center relative text-grayscale-white w-full h-[calc(100dvh)] overflow-scroll hide-scrollbar">
      <Image
        src="/icons/logo.svg"
        alt="orv logo"
        width={120}
        height={57}
        className="mb-[40px]"
      />

      <div className="h-[100px] flex flex-col justify-center">
        <div className="text-grayscale-white text-head2 text-center">
          예약을 완료했어요!
        </div>
        <div className="h-[8px]" />
        <div className="text-grayscale-400 text-body4 text-center">
          카카오톡으로 미리보기와 인터뷰 링크를 보내드려요
          <br />
          노트북이나 데스크탑으로 접속해주세요!
        </div>
      </div>
      
      <div className="fixed bottom-[26px] w-full z-50">
        <CTA
          text="홈으로 돌아가기"
          onClick={() => {
            router.replace(`/dashboard/home`);
          }}
          className="w-full h-[56px] mx-[20px]"
        />
      </div>
    </div>
  );
}

function CTA(props: { text: string; onClick: () => void; className?: string }) {
  return (
    <div className="w-full flex justify-center text-grayscale-800">
      <button
        style={{ boxShadow: "0px 0px 12px rgba(197, 209, 255, 0.6)" }}
        className={cn(
          "bg-main-lilac50 px-[13px] py-[9px] text-grayscale-800 text-head3 rounded-[10px] transition-all active:scale-95",
          props.className
        )}
        onClick={props.onClick}
      >
        {props.text}
      </button>
    </div>
  );
}
