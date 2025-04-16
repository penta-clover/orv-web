"use client";

import Link from "next/link";
import "@/app/components/blackBody.css";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Page() {
  const router = useRouter();

  return (
    <div className="relative bg-dark w-full">
      <CTA
        text="미래의 나에게 메시지 보내기"
        onClick={() => {
          router.push("/time-capsule/guide");
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
