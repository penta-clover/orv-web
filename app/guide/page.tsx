"use client";

import { useRouter } from "next/navigation";
import ActionBar from "./actionBar";
import * as ChannelService from "@channel.io/channel-web-sdk-loader";
import "./blackBody.css";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import CircleNumber from "./circleNumber";
import Line from "./line";
import { motion } from "framer-motion";

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

  useEffect(() => {
    let cookie = getCookie("channel-talk-temp-id");

    if (!cookie) {
      cookie = uuidv4();
      setCookie("channel-talk-temp-id", cookie, 7);
    }

    ChannelService.boot({
      pluginKey: "70a5c12a-ebe9-4acb-861c-1cb90ca98256",
      customLauncherSelector: ".channel-talk-button",
      hideChannelButtonOnBoot: true,
      memberId: cookie,
    });
  }, []);

  return (
    <div className="flex flex-col min-h-[calc(100dvh)] w-full">
      <ActionBar
        onServiceIntroductionClick={function (): void {
          router.push("/");
        }}
        onExploreClick={function (): void {
          router.push("/");
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
              2. 결제 및 예약 확정 (주간 사용권)
              <br />
              3. 주제 선택
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
              2. 음향 및 화면 각도 조절하기
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
              총 7~10개의 질문으로 인터뷰 진행
              <br />
              시간제한 없이 답변하기
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
              인터뷰를 마친 후,
              <br />
              QR 코드를 통해 영상 다운 받기
            </div>
          </div>
          <div className="absolute top-[0px] inset-y-0 left-[11.25px] flex flex-col items-center">
            <Line />
          </div>
          <div className="ml-[40px] h-[76px]">
            <button className="text-head4 text-system-info underline channel-talk-button">
              1:1 문의하기
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}



function setCookie(name: string, value: string, days: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// 쿠키 가져오기 함수
function getCookie(name: string) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
