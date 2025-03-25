"use client";

import CircleNumber from "./circleNumber";
import "@/app/components/blackBody.css";
import { AnimatePresence, motion } from "framer-motion";

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
  return (
    <div className="relative text-grayscale-white w-full h-full pt-[78px] overflow-scroll hide-scrollbar">
      <h1 className="text-2xl font-bold text-head0 mx-[40px] mb-[24px]">
        사용 가이드
      </h1>

      <div className="h-[276px] ml-[40px] w-full">
        <GuideLine />
      </div>
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
        <div className="absolute top-[22px] inset-y-0 left-[11.25px] flex flex-col items-center"></div>
        <div className="ml-[40px]">
          <div className="w-full text-head3 text-grayscale-200 mb-[8px]">
            신청하기
          </div>
          <div className="w-full text-body2 text-grayscale-500 mb-[32px]">
            1. www.orv.im 접속
            <br />
            2. 인터뷰 신청하기
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
        <div className="absolute top-[0px] inset-y-0 left-[11.25px] flex flex-col items-center"></div>
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
        <div className="absolute top-[0px] inset-y-0 left-[11.25px] flex flex-col items-center"></div>
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
