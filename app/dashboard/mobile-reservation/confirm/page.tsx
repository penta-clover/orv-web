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
        alt="logo"
        width={140}
        height={100}
      />

      <div className="h-[36px]" />
      <h1 className="text-center font-bold text-head0 mx-[20px] xs:mx-[40px]">
        예약을 완료했어요!
      </h1>
      <div className="flex flex-col">
        <span className="text-head4 text-center text-grayscale-100 px-[20px]">
          카카오톡으로 미리보기와 인터뷰 링크를 보내드려요
        </span>
        <span className="text-head4 text-center text-grayscale-100 px-[20px]">
          노트북이나 데스크탑으로 접속해주세요!
        </span>
      </div>
      <div className="fixed bottom-[26px] w-full z-50">
        <CTA
          text="다음으로"
          onClick={() => {
            router.replace(`/dashboard/home`);
          }}
          className="w-full h-[56px] mx-[20px] text-head3"
        />
      </div>
    </div>
  );
}

function CTA(props: { text: string; onClick: () => void; className?: string }) {
  return (
    <div className="w-full flex justify-center">
      <button
        style={{ boxShadow: "0px 0px 12px rgba(197, 209, 255, 0.6)" }}
        className={cn(
          "bg-main-lilac50 px-[13px] py-[9px] text-grayscale-800 text-head4 rounded-[10px] transition-all active:scale-95",
          props.className
        )}
        onClick={props.onClick}
      >
        {props.text}
      </button>
    </div>
  );
}
