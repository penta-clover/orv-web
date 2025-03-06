"use client";

import { useRouter } from "next/navigation";
import ActionBar from "./actionBar";
import "@/app/components/blackBody.css";
import CircleNumber from "./circleNumber";
import Line from "./line";
import { AnimatePresence, motion } from "framer-motion";

import Image from "next/image";
import FAQ from "../../../components/faq";
import { useSidebar } from "../sidebarContext";
import { useEffect, useState } from "react";
import ChannelTalkButton from "@/app/components/channelTalkButton";
import { track } from "@/app/amplitude";

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
  const { setIsSidebarOpen } = useSidebar()!;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [referralCode, setReferralCode] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredImages.length);
    }, 2000); // 1초마다 이미지 변경
    return () => clearInterval(interval);
  }, [referralCode]);

  // 레퍼럴 코드 쿠키에서 가져오기
  useEffect(() => {
    const parseCookies = () => {
      return document.cookie.split("; ").reduce((cookies: any, cookieStr) => {
        const [name, ...rest] = cookieStr.split("=");
        cookies[name] = rest.join("=");
        return cookies;
      }, {});
    };

    const cookies = parseCookies();
    setReferralCode(cookies["orv-landing-referral"] || "");
  }, []);

  const images = [
    {
      referral: "GA",
      src: "/images/landing-demo-ga.jpg",
      alt: "데모 이미지",
      className: "object-cover rounded-[8px]",
    },
    {
      referral: "GA",
      src: "/images/guide-qr-example.png", // QR 이미지 파일 경로로 변경하세요.
      alt: "QR 이미지",
      className: "object-contain p-[35px]",
    },
    {
      referral: "JS",
      src: "/images/landing-demo-js.jpg",
      alt: "데모 이미지",
      className: "object-cover rounded-[8px]",
    },
    {
      referral: "JS",
      src: "/images/guide-qr-example.png", // QR 이미지 파일 경로로 변경하세요.
      alt: "QR 이미지",
      className: "object-contain p-[35px]",
    },
    {
      referral: "JM",
      src: "/images/landing-demo-jm.jpg",
      alt: "데모 이미지",
      className: "object-cover rounded-[8px]",
    },
    {
      referral: "JM",
      src: "/images/guide-qr-example.png", // QR 이미지 파일 경로로 변경하세요.
      alt: "QR 이미지",
      className: "object-contain p-[35px]",
    },
    {
      referral: "HS",
      src: "/images/landing-demo-hs.jpg",
      alt: "데모 이미지",
      className: "object-cover rounded-[8px]",
    },
    {
      referral: "HS",
      src: "/images/guide-qr-example.png", // QR 이미지 파일 경로로 변경하세요.
      alt: "QR 이미지",
      className: "object-contain p-[35px]",
    },
  ];

  // props로 주어진 referral code와 동일한 referral을 가진 이미지 제외
  const filteredImages = images.filter(
    (image) => image.referral !== referralCode
  );

  return (
    <div className="flex flex-col min-h-[calc(100dvh)] w-full">
      <ActionBar
        title="오브 사용 가이드"
        onClickBack={() => {
          router.back();
        }}
        onClickMenu={() => setIsSidebarOpen(true)}
      />

      <div className="h-[16px]" />

      <div className="flex flex-col items-center gap-[16px]">
        <div className="relative w-[270.2px] h-[152px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={filteredImages[currentIndex].src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute top-0 left-0 w-full h-full"
            >
              <Image
                src={filteredImages[currentIndex].src}
                alt={filteredImages[currentIndex].alt}
                fill
                className={filteredImages[currentIndex].className}
              />
            </motion.div>
          </AnimatePresence>
        </div>

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
        onClick={() => {
          track("click_start_earlybird");
          router.push("/landing/v2/pricing");
        }}
      >
        오브 얼리버드 신청하기
      </div>

      <div className="h-[20px]" />

      <div
        className="flex flex-row justify-center items-center bg-main-lilac50 rounded-[12px] h-[56px] w-[calc(100%-32px)] mx-[16px] text-head4 text-grayscale-800 active:scale-95 transition-all"
        onClick={() => {
          track("click_introduction_landing");
          router.push("/landing/v2");
        }}
      >
        소개 페이지로 돌아가기
      </div>

      <div className="h-[32px]" />

      <FAQ faqData={getFAQData()} />

      <div className="h-[36px]" />

      <div className="w-full pl-[16px]">
        <ChannelTalkButton text="1:1 문의" className="h-[38px]" />
      </div>

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
      question: "인터뷰는 몇개의 질문으로 구성되어 있나요?",
      answer: "하나의 주제는 7~9개 사이의 질문으로 구성되어 있습니다.",
    },
    {
      question: "원하는 질문만 골라서 답변할 수도 있나요?",
      answer:
        "네. 제시된 질문 중에서 원하는 질문만 선택하여 답변하실 수 있습니다.",
    },
    {
      question: "노트북, 스마트폰, 태블릿 모두 사용할 수 있나요?",
      answer:
        "네, 웹캠이나 카메라가 탑재된 기기라면 문제없이 이용하실 수 있습니다. 하지만 노트북이나 태블릿 기기 사용을 권해드리고 있습니다.",
    },
    {
      question: "녹화 영상은 어디에 저장되나요?",
      answer:
        "인터뷰가 끝나면 QR 코드로 다운로드하실 수 있도록, 녹화 직후 1시간 동안 오브 클라우드에 암호화되어 보관됩니다. 이후 자동으로 삭제되며, 추후에는 희망하시는 분들께 영상을 장기간 보관할 수 있는 서비스를 제공할 계획입니다.",
    },
    {
      question: "이외에 문의 사항은 어디로 연락하면 되나요?",
      answer:
        "본 페이지 하단의 1:1 문의를 통해 문의 사항을 남겨주시면 빠른 시일 내에 답변 드리겠습니다.",
    },
  ];

  return faqData;
}
