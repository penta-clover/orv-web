"use client";

import Link from "next/link";
import "@/app/components/blackBody.css";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";

export default function Page() {
  return (
    <Suspense>
      <Body />
    </Suspense>
  );
}

function Body() {
  const searchParam = useSearchParams();
  const referral = searchParam.get("ref")!;
  const router = useRouter();

  return (
    <div className="relative bg-dark w-full h-[calc(100dvh)] overflow-y-scroll hide-scrollbar">
      <div className="absolute top-0 left-0 right-0 z-40">
        <ActionBar />
      </div>

      <Capsule />

      <div className="h-[15px] shrink-0" />

      <div className="flex flex-col mx-[15px]">
        <span className="text-head1 text-[22px] leading-[32px] text-grayscale-white">
          {referral ? (
            <>
              {referral}
              <span className="font-normal">님이 당신을</span>
            </>
          ) : (
            "당신을"
          )}
        </span>
        <span className="text-head1 text-[22px] leading-[32px] text-grayscale-white">
          60초 타임캡슐 프로젝트
          <span className="font-normal">
            {referral ? "에 초대했어요" : "에 초대합니다"}
          </span>
        </span>
        <span className="text-body4 text-grayscale-300">
          당신의 오늘을 60초 안에 담아, 미래의 나에게 전달해보세요. 1년 후
          타임캡슐이 당신에게 돌아옵니다.
        </span>
      </div>

      <div className="h-[50px] shrink-0" />

      <CTA
        text="60초 타임캡슐 시작하기"
        onClick={() => {
          router.push("/time-capsule/guide");
        }}
        className="w-full h-[56px] mx-[16px] text-head3"
      />

      <div className="h-[8px] shrink-0" />

      <div className="w-full text-center text-caption1 text-grayscale-300">
        지금까지 <span className="text-grayscale-white">372</span>명이 이
        프로젝트를 함께하고 있어요
      </div>

      <div className="h-[125px] shrink-0" />

      <DemoVideo />

      <div className="h-[125px] shrink-0" />

      <QuestionSection />

      <div className="h-[125px] shrink-0" />

      <ExampleSection />

      <div className="h-[125px] shrink-0" />

      <Introduction />

      <div className="h-[70px] shrink-0" />

      <CTA
        text="나만의 타임캡슐 생성하기"
        onClick={() => {
          router.push("/time-capsule/guide");
        }}
        className="w-full h-[56px] mx-[16px] text-head3"
      />

      <div className="h-[26px] shrink-0" />
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

function ActionBar() {
  return (
    <div className="h-[56px] w-full flex flex-row pl-[16px] shrink-0">
      <Image src="/icons/logo.svg" alt="logo" width={42} height={20} />
    </div>
  );
}

function Capsule() {
  return (
    <div className="relative h-[400px] w-full">
      <Image
        src={
          "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/milky-way.jpg"
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
        }}
      />

      <div className="grow" />

      <div className="flex flex-col justify-center items-center w-full h-full animate-updown gap-[32px]">
        <div className="flex justify-center items-center bg-grayscale-white w-[263px] h-[36px] rounded-[8px] text-body4 text-grayscale-700">
          <span className="font-bold">1년 전의 나</span>로부터&nbsp;
          <span className="font-bold">타임캡슐</span>이 도착했어요.
        </div>

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
    </div>
  );
}

function QuestionSection() {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-head1 text-grayscale-white flex flex-col items-center">
        <span>지금으로부터 1년 전</span>
        <span>당신의 모습을 기억하나요?</span>
      </div>
      <div className="h-[16px]" />
      <div className="text-body2 text-grayscale-400 flex flex-col items-center">
        <span>1년 전의 내 모습을 떠올려보세요</span>
      </div>
      <div className="h-[24px]" />
      <Image
        unoptimized
        src="https://d3bdjeyz3ry3pi.cloudfront.net/static/images/question-burble.png"
        width={287}
        height={214}
        alt="question burble"
      />
    </div>
  );
}

function ExampleSection() {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-head1 text-grayscale-white flex flex-col items-center">
        <span>기억 속에서 곧 사라져버릴</span>
        <span>오늘의 표정, 기분, 그리고 분위기</span>
      </div>
      <div className="h-[16px]" />
      <div className="text-body2 text-grayscale-400 flex flex-col items-center">
        <span>지금 이 순간을 타임캡슐에 담아 1년 뒤 꺼내보세요</span>
      </div>
      <div className="h-[24px]" />
      <Image
        unoptimized
        src="https://d3bdjeyz3ry3pi.cloudfront.net/static/images/landing-demo-ga.jpg"
        width={0}
        height={233}
        style={{
          width: "100%",
          objectFit: "contain",
          zIndex: 10,
        }}
        alt="question burble"
      />
    </div>
  );
}

function DemoVideo() {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-head1 text-grayscale-white flex flex-col items-center">
        <span>1년 전 과거의 나로부터</span>
        <span>도착한 타임캡슐</span>
      </div>
      <div className="h-[16px]" />
      <div className="text-body2 text-grayscale-400 flex flex-col items-center">
        <span>그 날의 감정, 기분, 온도가 고스란히 담긴 기억이 배달됐어요</span>
      </div>
      <div className="h-[24px]" />

      <div className="w-full aspect-[16/9] relative">
        <video
          src="https://d3bdjeyz3ry3pi.cloudfront.net/static/videos/timecapsule-demo-video-13fps.mp4"
          width={0}
          height={0}
          autoPlay
          muted
          playsInline
          loop
          style={{
            objectFit: "contain",
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
}

function Introduction() {
  const [now, setNow] = useState<Date>();
  const [start, setStart] = useState<Date>();
  const [elapsed, setElapsed] = useState<number>(0);

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setStart(new Date());
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const period = hours < 12 ? "오전" : "오후";
    hours = hours % 12;
    if (hours === 0) hours = 12;
    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(seconds).padStart(2, "0");
    return `${year}년 ${month}월 ${day}일 ${period} ${hours}시 ${paddedMinutes}분 ${paddedSeconds}초`;
  };

  return (
    <div className="flex flex-col gap-[26px] text-grayscale-white mx-[20px]">
      <span className="text-head2">{now ? formatDate(now) : ""}</span>

      {now && start && (
        <span className="text-body2">
          이곳에 들어온 지 어느새 {elapsed}초가 흘렀어요.
        </span>
      )}

      <span className="text-body2">
        단 1분, 그 시간을 타임캡슐에 담아 당신의 소중한 순간을 기록해 보세요.
      </span>

      <span className="text-body2">
        오늘 남긴 이 짧은 기록이 미래의 나에게 특별한 선물이 될 거예요. 당신의
        이야기로 타임캡슐을 완성해주세요.
      </span>
    </div>
  );
}
