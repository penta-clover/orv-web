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
import { useRef } from "react";
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
    track("click_start_orv", { "y_top": window.scrollY, "y_bottom": window.scrollY + window.innerHeight });
    router.push("/landing/registration");
  }
  
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
  return (
    <div className="flex flex-col items-center w-full h-auto">
      <Image
        src={"/images/question-example.png"}
        width={0}
        height={0}
        sizes="100vw"
        alt={"question example"}
        className="w-full h-auto px-[16px]"
        style={{ objectFit: "fill" }}
      />

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
