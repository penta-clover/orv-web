"use client";

import ActionBar from "./actionBar";
import { useRouter } from "next/navigation";
import EndingComment from "./endingComment";
import Image from "next/image";
import AutoScroll from "embla-carousel-auto-scroll";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import FloatingButton from "./floatingButton";
import ProjectorSection from "./projectorSection";

import "./blackBody.css";
import DescriptionSection from "./descriptionSection";
import { useEffect, useRef, useState } from "react";
import Footer from "./footer";
import { track } from "../amplitude";

export default function Page() {
  const videoRef = useRef(null);
  const router = useRouter();

  // 영상 재생 종료 시 화면 아래로 스크롤
  const handleVideoEnd = () => {
    if (window.scrollY < 50) {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  const onClickStartButton = () => {
    track("click_start_orv", {
      y_top: window.scrollY,
      y_bottom: window.scrollY + window.innerHeight,
    });
    router.push("/landing/registration");
  };

  return (
    <div className="relative bg-dark">
      <div className="absolute top-0 w-full z-50">
        <ActionBar
          onClickGuide={() => {
            track("click_guide_landing");
            router.push("/guide");
          }}
          onClickExplore={() => {
            track("click_lookaround_landing");
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
          }}
        />
      </div>
      <div className="relative w-full h-[calc(100vh)] flex justify-center items-center">
        <div className="absolute top-[52px] w-full">
          <Image
            src="/images/dark-wave.png"
            width={375}
            height={222}
            alt="dark wave"
            className="w-full h-auto"
          />
        </div>

        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
          className="w-full block z-10"
        >
          <source src="videos/landing-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute bottom-[135px] w-full transform scale-[-1]">
          <Image
            src="/images/dark-wave.png"
            width={375}
            height={222}
            alt="dark wave"
            className="w-full h-auto"
          />
        </div>
      </div>

      <h1 id="introduction-start" className="h-[45px]" />

      <MirrorSection />

      <div className="h-[150px]" />

      <VideoCarousel />

      <div className="h-[150px]" />

      <QuestionExample />

      <div className="h-[150px]" />

      <ProjectorSection />

      <div className="h-[121px]" />

      <DescriptionSection />

      <div className="h-[93px]" />

      <EndingComment />

      <div className="h-[72px]" />

      <Footer />

      <div className="fixed bottom-[32px] w-full max-w-[450px] z-50">
        <FloatingButton onClick={onClickStartButton} />
      </div>
    </div>
  );
}

function MirrorSection() {
  return (
    <div className="flex flex-col items-center h-[543px]">
      <Image
        src="/icons/logo-mirror.svg"
        width={54}
        height={16.62}
        alt="logo"
        className="mb-[12px]"
      />
      <div className="text-head1 text-white mb-[16px]">
        나만을 위한 인터뷰 시간
      </div>
      <div className="text-body2 text-grayscale-500">
        내가 아니면 누구도 해주지 않을 질문을 던져주는 곳
      </div>
      <div className="text-body2 text-grayscale-500">
        당신만을 위한 인터뷰를 기록하는
      </div>
      <div className="text-body2 text-main-lilac50 mb-[56px]">
        프라이빗 공간 오브입니다
      </div>

      <div className="relative h-[223px] w-full flex justify-center overflow-x-hidden">
        <Image
          src="/icons/mirror-frame.svg"
          width={483.2}
          height={168.81}
          alt="mirror frame"
          className="absolute top-[38px]"
          style={{ maxWidth: "none" }}
        />
        <Image
          src="/images/interviewee-mirror.png"
          width={209}
          height={223}
          alt="profile mirror"
          className="z-10"
        />
      </div>

      <div className="text-body2 text-white mt-[48px]">
        당신을 인터뷰하는 질문에 답변하고
      </div>
      <div className="text-body2 text-white ">
        나의 목소리, 표정 그리고 그날의 분위기를 기록해요
      </div>
    </div>
  );
}

function VideoCarousel() {
  return (
    <div className="flex flex-col gap-[32px]">
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
      >
        <CarouselContent className="flex">
          <CarouselItem className="w-[256px] h-[152px] p-0 mx-[4px] basis-auto">
            <Image
              src="/images/demo-1.png"
              width={256}
              height={152}
              alt="card"
              className="rounded"
            />
          </CarouselItem>
          <CarouselItem className="w-[256px] h-[152px] p-0 mx-[4px] basis-auto">
            <Image
              src="/images/demo-2.png"
              width={256}
              height={152}
              alt="card"
              className="rounded"
            />
          </CarouselItem>
          <CarouselItem className="w-[256px] h-[152px] p-0 mx-[4px] basis-auto">
            <Image
              src="/images/demo-3.png"
              width={256}
              height={152}
              alt="card"
              className="rounded"
            />
          </CarouselItem>
          <CarouselItem className="w-[256px] h-[152px] p-0 mx-[4px] basis-auto">
            <Image
              src="/images/demo-1.png"
              width={256}
              height={152}
              alt="card"
              className="rounded"
            />
          </CarouselItem>
          <CarouselItem className="w-[256px] h-[152px] p-0 mx-[4px] basis-auto">
            <Image
              src="/images/demo-2.png"
              width={256}
              height={152}
              alt="card"
              className="rounded"
            />
          </CarouselItem>
          <CarouselItem className="w-[256px] h-[152px] p-0 mx-[4px] basis-auto">
            <Image
              src="/images/demo-3.png"
              width={256}
              height={152}
              alt="card"
              className="rounded"
            />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
      <div className="flex flex-col items-center">
        <div className="text-white text-body2">
          한번의 인터뷰가 마무리되면 그날의 영상을
        </div>
        <div className="text-white text-body2">바로 QR로 받아볼 수 있어요</div>
      </div>
    </div>
  );
}

function QuestionExample() {
  const questions = [
    [
      "과거로 돌아가서",
      "인생을 새롭게 살 수 있다면",
      "언제로 돌아가실 건가요?",
    ],
    [
      "만약 좋아하는 영화 속",
      "인물이 될 수 있다면",
      "어떤 인물이 되고 싶나요?",
    ],
    [
      "기억에 남는 흑역사가 있나요?",
      "그 흑역사를 함께 알고 있는",
      "사람은 누구인가요?",
    ],
    ["1년 전의 나에게", "조언을 한다면", "어떤 말을 하시겠어요?"],
    [
      "지금 내 핸드폰에 있는",
      "가장 오래된 사진을 보여주고",
      "그 사진을 설명해주세요",
    ],
    ["요즘 나의 이상형은?", "전과 달라진 부분이 있다면", "함께 설명해주세요"],
    ["나 스스로를", "단어로 표현한다면", "어떤 단어들이 떠오르나요?"],
    ["요즘 나에게 가장", "행복을 주는 것은 무엇인가요?"],
    [
      "과거의 나에게 지금의 생각을",
      "5글자로 전할 수 있다면",
      "언제 무슨 말을 전할 건가요?",
    ],
  ];
  const [selectedQuestionIdx, setSelectedQuestionIdx] = useState(0);
  const [opacity, setOpacity] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      // 현재 표시되고 있는 질문 fade-out 효과 주기
      setOpacity(0);

      // 0.5초 뒤에 질문 바꾸고 fade-in 효과 주기
      setTimeout(() => {
        setSelectedQuestionIdx((prev) => (prev + 1) % questions.length);
        setOpacity(100);
      }, 1000);
    }, 2500); // 이 과정을 5초마다 반복

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center w-full h-auto">
      <div className="relative w-full flex justify-center">
        <Image
          src={"/images/question-board.png"}
          width={0}
          height={0}
          sizes="100vw"
          alt={"question example"}
          className="w-full max-w-[343px] h-auto"
          style={{ objectFit: "fill" }}
        />

        <div className={`absolute top-0 h-full w-full flex flex-col justify-center items-center transition-opacity duration-1000 opacity-${opacity}`}>
          {questions[selectedQuestionIdx].map((text, index) => (
            <div
              key={index}
              className="text-grayscale-600 font-regular text-[20px] leading-[28px] text-center font-onglyph"
            >
              {text}
            </div>
          ))}
        </div>
      </div>

      <div className="h-[40px]" />

      <div className="flex flex-col items-center">
        <div className="text-white text-body2">
          오브에서 던져주는 질문을 통해
        </div>
        <div className="text-white text-body2">나 스스로와 대화하세요</div>

        <div className="h-[16px]" />
        <div className="text-white text-body2">
          이 과정에서 <span className="text-main-lilac50">진짜 나</span>를
          마주해보세요
        </div>
      </div>
    </div>
  );
}
