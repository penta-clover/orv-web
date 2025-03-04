"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import ActionBar from "./actionBar";
import "@/app/components/blackBody.css";
import AutoScroll from "embla-carousel-auto-scroll";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSidebar } from "../sidebarContext";

export default function Page() {
  const router = useRouter();
  const { setIsSidebarOpen } = useSidebar()!;

  return (
    <div>
      <ActionBar
        title="주제 미리보기"
        onClickBack={() => router.back()}
        onClickMenu={() => setIsSidebarOpen(true)}
      />
      <div className="flex flex-col h-full items-center">
        <div className="h-[24px]" />

        <Headline />

        <div className="h-[24px]" />

        <PeopleExample />

        <div className="h-[48px]" />

        <TopicPreview />

        <div className="h-[72px]" />

        <OtherTopcis />

        <div className="h-[64px]" />

        <div
          className="flex flex-row justify-center items-center bg-gd rounded-[12px] h-[56px] w-[calc(100%-32px)] mx-[16px] text-head4 text-grayscale-800 active:scale-95 transition-all"
          onClick={() => router.push("/landing/v2/pricing")}
        >
          오브 얼리버드 신청하기
        </div>

        <div className="h-[20px]" />

        <div
          className="flex flex-row justify-center items-center bg-main-lilac50 rounded-[12px] h-[56px] w-[calc(100%-32px)] mx-[16px] text-head4 text-grayscale-800 active:scale-95 transition-all"
          onClick={() => router.push("/landing/v2")}
        >
          소개 페이지로 돌아가기
        </div>

        <div className="h-[32px]" />
      </div>
    </div>
  );
}

function Headline() {
  return (
    <div className="text-head1 text-grayscale-white text-center">
      원하는 인터뷰 주제를
      <br />
      선택할 수 있어요
    </div>
  );
}

function PeopleExample(props: { referralCode?: string }) {
  const images: { referral: string; src: string }[] = [
    {
      referral: "JH",
      src: "/images/landing-demo-jh.jpg",
    },
    {
      referral: "HJ",
      src: "/images/landing-demo-hj.jpg",
    },
    {
      referral: "JM",
      src: "/images/landing-demo-jm.jpg",
    },
    {
      referral: "JS",
      src: "/images/landing-demo-js.jpg",
    },
    {
      referral: "GA",
      src: "/images/landing-demo-ga.jpg",
    },
  ];

  // props로 주어진 referral code와 동일한 referral을 가진 이미지 제외
  const filteredImages = images.filter(
    (image) => image.referral !== props.referralCode
  );

  return (
    <Carousel
      opts={{
        align: "center",
        loop: true,
      }}
      plugins={[
        AutoScroll({
          speed: 0.8,
        }),
      ]}
      className="w-full"
    >
      <CarouselContent className="flex">
        {filteredImages.map((image, index) => (
          <CarouselItem
            key={index}
            className="w-[256px] h-[152px] p-0 mx-[4px] basis-auto"
          >
            <Image
              src={image.src}
              width={256}
              height={152}
              alt="card"
              className="rounded w-[256px] h-[152px]"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

function TopicPreview() {
  const examples = [
    {
      topic: "죽음",
      description: (
        <>
          한 번도 맞이해 본 적 없는 죽음을 상상하며
          <br />
          자신을 돌아 볼 수 있어요
        </>
      ),
      question: (
        <>
          나는 어떤 사람으로 기억되고 싶나요?
          <br />
          유언장에는 어떤 내용을 적을 것인가요?
        </>
      ),
    },
    {
      topic: "가치관",
      description: (
        <>
          나에게 가장 소중한 가치는 무엇인가요?
          <br />
          내가 진정 원하는 것이 무엇인지 알 수 있어요
        </>
      ),
      question: (
        <>
          당신은 지금 어떤 고민을 갖고 계신가요?
          <br />
          가장 자랑스러운 경험은 무엇인가요?
        </>
      ),
    },
    {
      topic: "감정",
      description: (
        <>
          나는 언제 어떤 감정을 느끼고 있을까요?
          <br />
          내면의 솔직한 목소리에 귀기울여 보아요
        </>
      ),
      question: (
        <>
          화를 내고 후회했던 순간이 있나요?
          <br />
          감정을 삼키고 후회한 순간이 있나요?
        </>
      ),
    },
    {
      topic: "정체성",
      description: (
        <>
          나는 어떤 사람이고 싶은가요?
          <br />
          진정한 나를 찾아갈 수 있어요
        </>
      ),
      question: (
        <>
          자신을 표현하는 한 단어는 무엇인가요?
          <br />
          나는 다른 사람에게 어떻게 보여지나요?
        </>
      ),
    },
  ];
  const [selectedIdx, setSelectedIdx] = useState(0);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-caption1 text-grayscale-500 mb-[4px]">
        주제 미리보기
      </div>
      <div className="text-head2 text-grayscale-white text-center">
        전체 20가지 주제 중 4가지만
        <br />
        맛보기로 보여드려요.
        <br />
        아래 주제를 클릭해서 살펴보세요.
      </div>
      <div className="h-[32px]" />

      <div className="flex flex-row w-[343px] items-center gap-[12px]">
        {examples.map((example, idx) => {
          return (
            <button
              key={idx}
              className={`px-[16px] py-[6px] bg-grayscle-800 border-[1px] border-grayscle-700 text-grayscale-500 text-body3 rounded-[24px] ${
                selectedIdx === idx
                  ? "border-main-lilac50 text-main-lilac50"
                  : ""
              }`}
              onClick={() => setSelectedIdx(idx)}
            >
              {example.topic}
            </button>
          );
        })}
      </div>

      <div className="h-[18px]" />

      <div className="flex flex-col p-[18px] items-start w-[343px] border-main-lilac50 border-[1px] rounded-[8px]">
        <span className="text-main-lilac50 text-head3 mb-[2px]">
          {examples[selectedIdx].topic}
        </span>
        <span className="text-grayscale-500 text-body3">
          {examples[selectedIdx].description}
        </span>

        <div className="h-[15px]" />

        <div className="flex flex-row items-center gap-[9px] h-[58px]">
          <div className="bg-grayscale-600 w-[2px] h-full rounded" />
          <span className="text-head3 text-grayscale-100">
            {examples[selectedIdx].question}
          </span>
        </div>

        <div className="h-[15px]" />

        <div className="text-grayscale-600 text-caption2">
          전체 질문은 인터뷰 시작 전 공개됩니다.
        </div>
      </div>
    </div>
  );
}

function OtherTopcis() {
  const topics = [
    [
      "돈",
      "존재",
      "시간",
      "미련",
      "사랑",
      "자신감",
      "희망",
      "친구",
      "명예",
      "추억",
      "꿈",
      "양심",
      "가족",
      "실패",
      "죽음",
      "가치관",
      "감정",
      "정체성",
      "관계",
      "행복",
    ],
    [
      "친구",
      "명예",
      "추억",
      "꿈",
      "양심",
      "가족",
      "실패",
      "죽음",
      "가치관",
      "감정",
      "정체성",
      "관계",
      "행복",
      "돈",
      "존재",
      "시간",
      "미련",
      "사랑",
      "자신감",
      "희망",
    ],
    [
      "죽음",
      "가치관",
      "감정",
      "정체성",
      "관계",
      "행복",
      "돈",
      "존재",
      "시간",
      "미련",
      "사랑",
      "자신감",
      "희망",
      "친구",
      "명예",
      "추억",
      "꿈",
      "양심",
      "가족",
      "실패",
    ],
  ];

  return (
    <div className="flex flex-col w-full">
      <div className="text-head2 text-grayscale-white text-center">
        이 밖에도 16가지의
        <br />
        다양한 주제가 준비돼 있어요
      </div>

      <div className="h-[8px]" />

      <div className="text-body3 text-grayscale-500 text-center">
        주제들은 계속해서 업데이트 돼요
      </div>

      <div className="h-[32px]" />

      <div className="flex flex-col gap-[16px] w-full">
        {topics.map((topicRow, idx) => {
          return (
            <Carousel
              key={idx}
              opts={{
                align: "center",
                loop: true,
              }}
              plugins={[
                AutoScroll({
                  speed: 0.6 - idx / 5.0,
                  direction: idx % 2 === 0 ? "forward" : "backward",
                }),
              ]}
              className="w-full"
            >
              <CarouselContent className="flex">
                {topicRow.map((topic, index) => (
                  <CarouselItem
                    key={index}
                    className="px-[16px] py-[6px] ml-[12px] basis-auto bg-grayscale-700 rounded-[8px] text-head4 text-grayscale-200"
                  >
                    {topic}
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          );
        })}
      </div>
    </div>
  );
}
