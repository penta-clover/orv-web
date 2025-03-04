"use client";

import { useRouter } from "next/navigation";
import ActionBar from "./actionBar";
import "./blackBody.css";
import CircleNumber from "./circleNumber";
import Line from "./line";
import { motion } from "framer-motion";
import { track } from "../amplitude";
import ChannelTalkButton from "../components/channelTalkButton";

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
        onClickIntroduction={function (): void {
          track("click_introduction_landing");
          router.push("/");
        }}
        onClickExplore={function (): void {
          track("click_lookaround_guide");
          router.push("/landing/v2#introduction-start");
        }}
      />

      <div className="h-[16px]" />


      <div className="text-head1 text-grayscale-white ml-[17px]">
        오브 사용 가이드
      </div>

      <div className="h-[24px]" />

      <div className="flex flex-col grow">
        <motion.div className="relative w-full mx-[16px]" custom={0.1} variants={stepVariants} initial="hidden" animate="visible">
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
              2. 일일 사용권 결제
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;- 24시간 동안 무제한으로 사용 가능해요
              <br />
              3. 주제 선택
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;- 인터뷰 주제와 질문은 계속 업데이트 돼요
            </div>
          </div>
        </motion.div>
        <motion.div className="relative w-full mx-[16px]" custom={0.25} variants={stepVariants} initial="hidden" animate="visible">
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
              1. 인터뷰를 위한 환경 조성하기
              <br />
              2. 음향 및 노트북 화면 각도 조절하기
              <br />
              3. 영상 필터 선택하기
            </div>
          </div>
        </motion.div>
        <motion.div className="relative w-full mx-[16px]" custom={0.4} variants={stepVariants} initial="hidden" animate="visible">
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
              1. 총 7~10개의 질문으로 인터뷰 진행
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;- 시간제한 없이 답변하기
            </div>
          </div>
        </motion.div>
        <motion.div className="relative w-full grow mx-[16px]" custom={0.55} variants={stepVariants} initial="hidden" animate="visible">
          <div className="absolute top-[0px] z-10 flex flex-col items-center">
            <CircleNumber num={4} />
          </div>
          <div className="absolute top-[0px] inset-y-0 left-[11.25px] flex flex-col items-center">
            <Line />
          </div>
          <div className="ml-[40px]">
            <div className="w-full text-head3 text-grayscale-200 mb-[8px]">
              받아보기
            </div>
            <div className="w-full text-body2 text-grayscale-500 mb-[24px]">
              1. 인터뷰를 마무리한 후
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;QR 코드를 통해 영상 다운 받기
            </div>
          </div>
          <div className="absolute top-[0px] inset-y-0 left-[11.25px] flex flex-col items-center">
            <Line />
          </div>
          <div className="ml-[40px] h-[76px]">
            <ChannelTalkButton text="1:1 문의하기"/>
          </div>
        </motion.div>
      </div>
    </div>
  );
}