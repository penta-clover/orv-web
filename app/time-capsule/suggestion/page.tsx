'use client';

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import "@/app/components/blackBody.css";

export default function Page() {
    const router = useRouter();
    
    return (
      <div>
        나를 기록하기 위한 다른 주제들도 준비돼있어요
        <CTA
          text="오브에서 더 알아보기"
          onClick={() => {
            router.push("/dashboard/home");
          }}
          className="w-full h-[56px] mx-[16px] text-head3"
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
