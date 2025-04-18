"use client";

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import "@/app/components/blackBody.css";
import { Suspense, use, useEffect, useState } from "react";
import { useMemberRepository } from "@/providers/MemberRepositoryContext";

export default function Page() {
  return (
    <Suspense>
      <Body />
    </Suspense>
  );
}

function Body() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic");
  const router = useRouter();

  const memberRepository = useMemberRepository();
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    memberRepository.getMyInfo().then((member) => {
      if (member) {
        setNickname(member.nickname);
      }
    });
  }, []);

  return (
    <div className="flex flex-col relative bg-dark w-full h-[calc(100dvh)]">
      <div className="h-[20dvh]" />

      <div className="text-head1 text-grayscale-white mx-[16px]">
        정확히 1년 뒤,
        <br />
        {nickname ? `${nickname}님의 ` : ""}타임캡슐이 배달됩니다
      </div>

      <div className="text-grayscale-300 text-body4 mx-[16px]">
        타임캡슐을 보내드리기 위한 신분증이 발급됐어요. 꼭 잘 가지고 계셔야
        무사히 타임캡슐을 받으실 수 있어요!
      </div>
      <div className="grow" />

      <div className="absolute w-full bottom-[26px] z-10">
        <CTA
          text="타임캡슐 신분증 다운로드"
          onClick={() => {
            alert("구현중인 기능입니다.");
          }}
          className="w-full h-[48px] mx-[16px] text-head4 bg-grayscale-50"
        />

        <div className="h-[16px]" />

        <CTA
          text="다음으로"
          onClick={() => {
            router.push(`/time-capsule/invitation?topic=${topic}`);
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
