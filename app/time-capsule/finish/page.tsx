"use client";

import "@/app/components/blackBody.css";
import { cn } from "@/lib/utils";
import Image from "next/image";
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
    <div className="relative flex flex-col relative bg-dark w-full h-[calc(100dvh)]">
      <div className="h-[20dvh] shrink" />

      <div className="text-head1 text-grayscale-white mx-[16px] z-10">
        축하드려요!
        <br />첫 번째 타임캡슐이 완성됐어요!
      </div>

      <Image
        src={
          "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/milky-way.png"
        }
        unoptimized
        alt="milky-way"
        width={0}
        height={0}
        style={{
          objectFit: "fill",
          width: "100%",
          height: "100%",
          zIndex: 0,
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          opacity: "0.5",
        }}
      />

      <div className="grow" />

      <div className="flex justify-center w-full h-[210px]">
        <Image
          src={
            "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/time-capsule.png"
          }
          unoptimized
          alt="time capsule"
          width={0}
          height={0}
          style={{
            objectFit: "contain",
            width: "200px",
            height: "200px",
            zIndex: 10,
          }}
        />
      </div>

      <div className="grow" />
      <div className="h-[112px]" />

      <div className="absolute w-full bottom-[26px] z-10">
        <CTA
          text="다시 찍을래요"
          onClick={() => {
            router.push(`/time-capsule/setting/topic`);
          }}
          className="w-full h-[48px] mx-[16px] text-head4 bg-grayscale-50"
        />

        <div className="h-[16px]" />

        <CTA
          text="타임캡슐 받을 연락처 남기기"
          onClick={() => {
            router.push(`/time-capsule/join?blobKey=${blobKey}`);
          }}
          className="w-full h-[48px] mx-[16px] text-head4 bg-main-lilac50"
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
