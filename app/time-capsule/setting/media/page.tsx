"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="relative bg-dark w-full">
      <CTA
        text="좋아요! 내 모습도 남겨주세요"
        onClick={() => {
          router.push("/time-capsule/recording?aspect=frontal");
        }}
        className="w-full h-[56px] mx-[16px] text-head3 bg-main-lilac50"
      />
      <CTA
        text="음성만 녹음할게요"
        onClick={() => {
          router.push("/time-capsule/recording?aspect=none");
        }}
        className="w-full h-[56px] mx-[16px] text-head3 bg-grayscale-50"
      />
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
