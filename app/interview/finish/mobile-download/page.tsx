"use client";

import "@/app/components/blackBody.css";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const videoUrl = searchParams.get("videoUrl")!;
  const router = useRouter();

  const today = new Date();
  const formattedDate =
    today.getFullYear() +
    "." +
    String(today.getMonth() + 1).padStart(2, "0") +
    "." +
    String(today.getDate()).padStart(2, "0");

  return (
    <div className="flex flex-col h-[100dvh]">
      <div className="flex flex-col grow items-center justify-center pb-[182px]">
        <div className="text-white font-semibold text-[40px] leading-[64px] text-center">
          {formattedDate} 오늘은 여기까지
          <br />
          아래에서 영상을 받으시면 됩니다.
        </div>

        <div className="h-[84px]" />

        <video src={videoUrl} controls autoPlay muted/>

        <div className="h-[120px]" />

        <button
          className="w-[190px] h-[56px] rounded-[12px] text-head3 active:scale-95 bg-main-lilac50 text-grayscale-800 bg-grayscale-800 text-grayscale-500"
          onClick={() => {
            router.replace("/");
          }}
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}
