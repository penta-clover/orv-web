"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import "@/app/components/blackBody.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useMemberRepository } from "@/providers/MemberRepositoryContext";

export default function Page() {
  const [isCopied, setIsCopied] = useState(false);
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

  useEffect(() => {
    // 클립보드에 복사 성공 시 5초 후에 isCopied 상태를 false로 변경
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return (
    <div className="flex flex-col relative bg-dark w-full h-[calc(100dvh)]">
      <div className="h-[20dvh] shrink" />

      <div className="text-head1 text-grayscale-white mx-[16px] z-10">
        {nickname ? `${nickname}님이 ` : ""}다음 타임캡슐 참여자를
        <br />
        초대할 수 있는 링크를 생성했어요!
      </div>

      <div className="text-grayscale-300 text-body4 mx-[16px] z-10">
        타임캡슐 프로젝트에 함께 하고 싶은 친구를 직접 초대할 수 있어요.
        생각나는 친구에게 초대링크를 선물해주세요
      </div>
      <div className="grow" />

      <div className="flex justify-center w-full h-[200px]">
        <Image
          src={
            "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/letter-heart.png"
          }
          unoptimized
          alt="letter"
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
      <div className="h-[137px]" />

      <div className="absolute w-full bottom-[26px] z-10">
        <CTA
          text={isCopied ? "초대 링크 복사 완료" : "초대 링크 공유하기"}
          onClick={() => {
            // 클립보드에 복사
            navigator.clipboard.writeText("https://orv.im/time-capsule");
            setIsCopied(true);
          }}
          className={`w-full h-[48px] mx-[16px] text-head4 ${
            isCopied ? "bg-grayscale-white" : "bg-main-lilac50"
          }`}
        />

        <div className="h-[16px]" />

        <CTA
          text="다음으로"
          onClick={() => {
            router.push(`/time-capsule/suggestion`);
          }}
          className="w-full h-[48px] mx-[16px] text-head4 bg-gd"
        />
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
