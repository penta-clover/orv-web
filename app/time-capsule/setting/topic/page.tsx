"use client";

import Image from "next/image";
import "@/app/components/blackBody.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Page() {
  const [question, setQuestion] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const router = useRouter();

  const topics = [
    {
      imgUrl:
        "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/time-capsule-purple.png",
      alt: "timecapsule-purple",
      title: "가치관",
      question: "지금 나에게\n 가장 소중한 것은 무엇인가요?",
    },
    {
      imgUrl:
        "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/time-capsule-blue.png",
      alt: "timecapsule-blue",
      title: "과거",
      question: "과거로 돌아갈 수 있다면\n 언제로 가고 싶나요?",
    },
    {
      imgUrl:
        "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/time-capsule-red.png",
      alt: "timecapsule-red",
      title: "미래",
      question: "1년 뒤의 나는\n 어떤 모습이기를 바라나요?",
    },
    {
      imgUrl:
        "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/time-capsule-yellow.png",
      alt: "timecapsule-yellow",
      title: "용기",
      question: "2026년 어느 날, 지쳐있는 나를 위해\n 해주고 싶은 말이 있나요?",
    },
    {
      imgUrl:
        "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/time-capsule-green.png",
      alt: "timecapsule-green",
      title: "기록",
      question: "1년 뒤의 나에게\n 편지를 남겨주세요",
    },
    {
      imgUrl:
        "https://d3bdjeyz3ry3pi.cloudfront.net/static/images/time-capsule-orange.png",
      alt: "timecapsule-orange",
      title: "불안",
      question: "요즘 갖고 있는\n 가장 큰 고민은 무엇인가요?",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="h-[25px] grow" />

      <div className="text-head1 text-grayscale-white mx-[16px]">
        타임캡슐에 어떤 주제를 담을까요?
      </div>

      <div className="h-[15px]" />

      <div className="self-center grid grid-cols-3 grid-rows-2 gap-x-[20px] gap-y-[20px]">
        {topics.map((topic, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center transition-all active:scale-95"
            onClick={() => {
              setQuestion(topic.question);
              setSelectedTopic(topic.title);
            }}
          >
            <Image
              src={topic.imgUrl}
              unoptimized
              alt={topic.alt}
              width={100}
              height={100}
              className="w-[100px] h-[100px]"
            />
            <div className="text-head4 text-grayscale-white mt-2">
              {topic.title}
            </div>
          </div>
        ))}
      </div>

      <div className="h-[15px]" />

      <div
        className={`relative w-full flex justify-center h-[122px] transition-all ${
          selectedTopic ? "opacity-100" : "opacity-0"
        }`}
      >
        <Image
          unoptimized
          src="https://d3bdjeyz3ry3pi.cloudfront.net/static/images/question-board.png"
          width={0}
          height={0}
          sizes="100vw"
          alt={"question example"}
          className="w-full max-w-[343px] h-auto"
          style={{ objectFit: "fill" }}
        />

        <div
          className={`absolute top-0 h-full w-full flex flex-col justify-center items-center transition-opacity duration-700`}
        >
          <div className="text-grayscale-600 font-regular text-[20px] leading-[28px] text-center font-onglyph">
            {question
              ?.replace(/\\n/g, "\n")
              .split("\n")
              .map((line, index) => (
                <div key={index} className="text-center">
                  {line}
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="h-[15px] grow" />
      <div className="h-[74px]" />

      <div className="absolute w-full bottom-[26px] z-10">
        <CTA
          text={selectedTopic ? "시작하기" : "먼저 주제를 골라주세요"}
          onClick={() => {
            if (!selectedTopic) {
              return;
            }

            router.push(
              `/time-capsule/setting/media?topic=${selectedTopic}&question=${question}`
            );
          }}
          className={`w-full h-[48px] mx-[16px] text-head4 ${
            selectedTopic ? "bg-main-lilac50" : "bg-grayscale-50"
          }`}
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
