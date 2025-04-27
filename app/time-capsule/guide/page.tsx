"use client";

import "@/app/components/blackBody.css";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Page() {
  const router = useRouter();

  return (
    <div className="relative bg-dark w-full px-[20px] h-[calc(100dvh)] overflow-y-scroll hide-scrollbar">
      <div className="h-[75px] shrink-0" />

      <div className="text-head1 text-grayscale-white flex flex-col items-start">
        <span>60초 타임캡슐 프로젝트에</span>
        <span>참여하는 방법</span>
      </div>

      <div className="h-[75px] shrink-0" />

      <div className="flex items-center gap-[9px]">
        <CircleNumber num={1} />
        <span className="text-grayscale-300 text-head3">
          타임캡슐 주제 선택하기
        </span>
      </div>

      <div className="h-[20px] shrink-0" />

      <div className="flex w-full justify-center">
        <WorrySection />
      </div>

      <div className="h-[125px] shrink-0" />

      <div className="flex items-center gap-[9px]">
        <CircleNumber num={2} />
        <span className="text-grayscale-300 text-head3">
          60초 동안 내 생각 말하기
        </span>
      </div>

      <div className="h-[24px] shrink-0 text-body3 text-grayscale-400 font-normal ml-[33px]">
        영상편지, 음성편지 중 원하는대로 선택할 수 있어요
      </div>

      <div className="h-[20px] shrink-0" />

      <div className="flex w-full justify-center">
        <VideoExample />
      </div>

      <div className="h-[125px] shrink-0" />

      <div className="flex items-center gap-[9px]">
        <CircleNumber num={3} />
        <span className="text-grayscale-300 text-head3">
          타임캡슐에 함께 담을 것 선택하기
        </span>
      </div>

      <div className="h-[24px] shrink-0 text-body3 text-grayscale-400 font-normal ml-[33px]">
        영상편지와 함께 보낼 가상의 선물이 준비되어 있어요
      </div>

      <div className="h-[20px] shrink-0" />

      <div className="flex w-full justify-center items-center">
        <div className="flex justify-center w-[328px] bg-[#EFEFEF] rounded-[5px]">
          <Image
            src="https://d3bdjeyz3ry3pi.cloudfront.net/static/images/mysterious-gift.jpg"
            alt="letter"
            width={191}
            height={191}
          />
        </div>
      </div>

      <div className="h-[125px] shrink-0" />

      <div className="flex items-center gap-[9px]">
        <CircleNumber num={4} />
        <span className="text-grayscale-300 text-head3">
          1년 뒤, 타임캡슐 받아보기
        </span>
      </div>

      <div className="h-[24px] shrink-0 text-body3 text-grayscale-400 font-normal ml-[33px]">
        딱 1년 뒤 남겨주신 연락처로 타임캡슐을 보내드려요!
      </div>

      <div className="h-[20px] shrink-0" />

      <div className="flex w-full justify-center items-center">
        <Image
          src="https://d3bdjeyz3ry3pi.cloudfront.net/static/images/timecapsule-letter.png"
          alt="letter"
          width={327}
          height={192}
        />
      </div>

      <div className="h-[125px] shrink-0" />

      <div className="fixed flex justify-center w-full bottom-[26px] left-0 right-0 z-50">
        <CTA
          text="타임캡슐 시작하기"
          onClick={() => {
            router.push("/time-capsule/setting/topic");
          }}
          className="w-[calc(100%-40px)] max-w-[610px] h-[56px] text-head3"
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

function CircleNumber(props: { num: number }) {
  return (
    <div className="flex flex-col justify-center items-center w-[20px] h-[20px] m-[2px] rounded-full bg-main-lilac50 text-caption1 text-grayscale-black">
      {props.num}
    </div>
  );
}

function WorrySection() {
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    let timer: any;
    const handleScroll = () => {
      setScrolling(true);
      // 스크롤이 멈춘 후 150ms 이후에 애니메이션 제거 (원하는 시간으로 조정 가능)
      clearTimeout(timer);
      timer = setTimeout(() => setScrolling(false), 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center text-body4 text-grayscale-200 w-full max-w-[384px] gap-[22px]">
      <div className="flex flex-row w-full">
        <span
          className={`rounded-[8px] p-[12px] transition-all ${
            scrolling
              ? "animate-shake-1 text-grayscale-800 bg-grayscale-400"
              : "bg-grayscale-700"
          }`}
        >
          지금 나에게 가장 소중한 것은 무엇인가요?
        </span>
        <span className="grow" />
      </div>
      <div className="flex flex-row w-full">
        <span className="grow" />
        <span
          className={`rounded-[8px] p-[12px] transition-all ${
            scrolling
              ? "animate-shake-0.7 text-grayscale-800 bg-grayscale-200"
              : "bg-grayscale-800"
          }`}
        >
          일년 뒤의 나는 어떤 모습이기를 바라나요?
        </span>
      </div>
      <div className="flex flex-row w-full">
        <span
          className={`rounded-[8px] p-[12px] transition-all ${
            scrolling
              ? "animate-shake-1.2 text-grayscale-800 bg-grayscale-400"
              : "bg-grayscale-700"
          }`}
        >
          요즘 가지고 있는 고민이 있다면 알려주세요
        </span>
        <span className="grow" />
      </div>
    </div>
  );
}

function VideoExample() {
  return (
    <div className="relative flex flex-col items-center w-[376px]">
      <Image
        unoptimized
        src="https://d3bdjeyz3ry3pi.cloudfront.net/static/images/film.svg"
        alt="film"
        width={376}
        height={237}
        className="w-auto h-auto"
      />
      <div className="absolute top-[38px] left-[31px] z-10 flex flex-row items-center gap-[7px]">
        <Image
          unoptimized
          src="/icons/error-circle.svg"
          alt="error"
          width={12.48}
          height={12.48}
        />
        <div className="text-caption1 text-grayscale-700">REC</div>
      </div>
      <div className="absolute top-[38px] text-caption1 text-grayscale-700">
        24 : 00 : 00
      </div>
      <div className="absolute top-0 bottom-0 flex flex-col items-center justify-center z-10 w-full">
        <div className="text-white text-[18px] font-semibold">
          "지금 이 순간 나의 생각은..."
        </div>
      </div>
    </div>
  );
}
