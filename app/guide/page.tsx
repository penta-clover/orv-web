"use client";

import { useRouter } from "next/navigation";
import ActionBar from "./actionBar";
import "./blackBody.css";
import CircleNumber from "./circleNumber";
import Line from "./line";
import { motion } from "framer-motion";
import ChannelTalkButton from "../components/channelTalkButton";

import Image from "next/image";
import FAQ from "../components/faq";

// 애니메이션 Variants 설정
const stepVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom, duration: 0.5 },
  }),
};

export default function Page() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-[calc(100dvh)] w-full">
      <ActionBar
        title="오브 사용 가이드"
        onClickBack={() => {
          router.back();
        }}
        onClickMenu={() => {}}
      />

      <div className="h-[16px]" />

      <div className="flex flex-col items-center gap-[16px]">
        <Image
          src="/images/landing-demo-ga.jpg"
          width={256}
          height={152}
          alt="오브 사용 사례 이미지"
          className="rounded-[8px]"
        />

        <div className="w-full text-body2 text-grayscale-500 text-center">
          한번의 인터뷰가 마무리되면 그날의 영상을
          <br />
          바로 QR로 받아볼 수 있어요
        </div>
      </div>

      <div className="h-[32px]" />

      <GuideLine />

      <div className="h-[47px]" />

      <div
        className="flex flex-row justify-center items-center bg-gd rounded-[12px] h-[56px] w-[calc(100%-32px)] mx-[16px] text-head4 text-grayscale-800 active:scale-95 transition-all"
        onClick={() => {}}
      >
        오브 얼리버드 신청하기
      </div>

      <div className="h-[20px]" />

      <div
        className="flex flex-row justify-center items-center bg-main-lilac50 rounded-[12px] h-[56px] w-[calc(100%-32px)] mx-[16px] text-head4 text-grayscale-800 active:scale-95 transition-all"
        onClick={() => {}}
      >
        소개 페이지로 돌아가기
      </div>

      <div className="h-[32px]" />

      <FAQ faqData={getFAQData()} />

      <div className="h-[76px]" />
    </div>
  );
}

function GuideLine() {
  return (
    <div className="flex flex-col grow">
      <motion.div
        className="relative w-full mx-[16px]"
        custom={0.1}
        variants={stepVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute top-[0px] z-10 flex flex-col items-center">
          <CircleNumber num={1} />
        </div>
        <div className="absolute top-[22px] inset-y-0 left-[11.25px] flex flex-col items-center">
          <Line />
        </div>
        <div className="ml-[40px]">
          <div className="w-full text-head3 text-grayscale-200 mb-[8px]">
            신청하기
          </div>
          <div className="w-full text-body2 text-grayscale-500 mb-[32px]">
            1. www.orv.im 접속
            <br />
            2. 오브 티켓 결제하기
            <br />
            3. 알림으로 예약 확정 및 코드 받기
          </div>
        </div>
      </motion.div>
      <motion.div
        className="relative w-full mx-[16px]"
        custom={0.25}
        variants={stepVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute top-[0px] z-10 flex flex-col items-center">
          <CircleNumber num={2} />
        </div>
        <div className="absolute top-[0px] inset-y-0 left-[11.25px] flex flex-col items-center">
          <Line />
        </div>
        <div className="ml-[40px]">
          <div className="w-full text-head3 text-grayscale-200 mb-[8px]">
            인터뷰를 위한 준비하기
          </div>
          <div className="w-full text-body2 text-grayscale-500 mb-[32px]">
            1. 인터뷰 주제 선택하기
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;- 인터뷰 질문은 계속 업데이트 돼요
            <br />
            2. 음향 및 노트북 화면 각도 조절하기
            <br />
            3. 카메라 필터 선택하기
          </div>
        </div>
      </motion.div>
      <motion.div
        className="relative w-full mx-[16px]"
        custom={0.4}
        variants={stepVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute top-[0px] z-10 flex flex-col items-center">
          <CircleNumber num={3} />
        </div>
        <div className="absolute top-[0px] inset-y-0 left-[11.25px] flex flex-col items-center">
          <Line />
        </div>
        <div className="ml-[40px]">
          <div className="w-full text-head3 text-grayscale-200 mb-[8px]">
            인터뷰 진행하기
          </div>
          <div className="w-full text-body2 text-grayscale-500 mb-[32px]">
            &middot; 총 7~9개의 질문으로 인터뷰 진행
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;- 시간제한 없이 답변할 수 있어요
          </div>
        </div>
      </motion.div>
      <motion.div
        className="relative w-full mx-[16px]"
        custom={0.55}
        variants={stepVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute top-[0px] z-10 flex flex-col items-center">
          <CircleNumber num={4} />
        </div>
        <div className="ml-[40px]">
          <div className="w-full text-head3 text-grayscale-200 mb-[8px]">
            인터뷰 영상 다운받기
          </div>
          <div className="w-full text-body2 text-grayscale-500">
            &middot; 인터뷰를 마친 후
            <br />
            &nbsp;&nbsp;QR 코드를 통해 영상 다운 받기
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function getFAQData() {
  const faqData = [
    {
      question: "1회권이 아닌 이유는 무엇인가요?",
      answer: "예시 답변: 1회권이 아닌 이유에 대한 자세한 설명...",
    },
    {
      question: "인터뷰 주제는 몇 개로 구성되어 있나요?",
      answer:
        "예시 답변: 인터뷰 주제는 총 몇 개이며 어떤 내용들로 구성되어 있는지...",
    },
    {
      question: "오브 프로세스가 어떻게 되나요?",
      answer: "예시 답변: 오브 프로세스(OB Process)에 대한 상세한 진행 절차...",
    },
    {
      question: "오브 프로세스가 어떻게 되나요? (중복)",
      answer: "예시 답변: 동일 질문에 대한 예시 답변...",
    },
  ];

  return faqData;
}
