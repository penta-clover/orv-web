"use client";

import "@/app/components/blackBody.css";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <Body />
    </Suspense>
  );
}

function Body() {
  const searchParam = useSearchParams();
  const blobKey = searchParam.get("blobKey")!;
  const router = useRouter();

  return (
    <div>
      <div>
        <span>축하해요!</span>
        <span>첫 번째 타임캡슐이 만들어졌어요!</span>
      </div>
      
      <CTA
        text="타임캡슐 받을 연락처 남기기"
        onClick={() => {
          router.push(`/time-capsule/join?blobKey=${blobKey}`);
        }}
        className="w-full h-[56px] mx-[16px] text-head3 bg-main-lilac50"
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
